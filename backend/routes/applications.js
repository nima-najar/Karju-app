const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply to shift (worker only)
router.post('/',
  authenticate,
  authorize('worker'),
  [
    body('shiftId').isUUID(),
    body('applicationText').optional().isString().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { shiftId, applicationText } = req.body;

      // Check if shift exists and is open
      const shiftResult = await pool.query(
        'SELECT * FROM shifts WHERE id = $1 AND status = $2',
        [shiftId, 'open']
      );

      if (shiftResult.rows.length === 0) {
        return res.status(404).json({ message: 'Shift not found or not open' });
      }

      // Check if already applied
      const existingApp = await pool.query(
        'SELECT id FROM applications WHERE shift_id = $1 AND worker_id = $2',
        [shiftId, req.user.id]
      );

      if (existingApp.rows.length > 0) {
        return res.status(400).json({ message: 'Already applied to this shift' });
      }

      // Check if shift is full
      const filledResult = await pool.query(
        'SELECT COUNT(*) as count FROM applications WHERE shift_id = $1 AND status = $2',
        [shiftId, 'accepted']
      );

      const filled = parseInt(filledResult.rows[0].count);
      if (filled >= shiftResult.rows[0].number_of_positions) {
        return res.status(400).json({ message: 'Shift is already full' });
      }

      // Create application
      const result = await pool.query(
        `INSERT INTO applications (shift_id, worker_id, application_text)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [shiftId, req.user.id, applicationText || null]
      );

      // Create notification for business
      const businessResult = await pool.query(
        `SELECT b.user_id FROM businesses b 
         JOIN shifts s ON s.business_id = b.id 
         WHERE s.id = $1`,
        [shiftId]
      );

      if (businessResult.rows.length > 0) {
        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id)
           VALUES ($1, 'new_application', 'New Application', 'You have a new application for your shift', 'application', $2)`,
          [businessResult.rows[0].user_id, result.rows[0].id]
        );
      }

      res.status(201).json({ application: result.rows[0] });
    } catch (error) {
      console.error('Apply to shift error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get applications for a shift (business only)
router.get('/shift/:shiftId',
  authenticate,
  authorize('business'),
  async (req, res) => {
    try {
      const { shiftId } = req.params;

      // Verify ownership
      const shiftResult = await pool.query(
        `SELECT s.* FROM shifts s 
         JOIN businesses b ON s.business_id = b.id 
         WHERE s.id = $1 AND b.user_id = $2`,
        [shiftId, req.user.id]
      );

      if (shiftResult.rows.length === 0) {
        return res.status(404).json({ message: 'Shift not found or unauthorized' });
      }

      // Get applications with worker profiles
      const result = await pool.query(
        `SELECT 
          a.*,
          u.first_name,
          u.last_name,
          u.email,
          wp.bio,
          wp.skills,
          wp.experience_years,
          wp.average_rating,
          wp.total_ratings
         FROM applications a
         JOIN users u ON a.worker_id = u.id
         LEFT JOIN worker_profiles wp ON wp.user_id = u.id
         WHERE a.shift_id = $1
         ORDER BY a.applied_at DESC`,
        [shiftId]
      );

      res.json({ applications: result.rows });
    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get worker's applications
router.get('/worker/my-applications',
  authenticate,
  authorize('worker'),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT 
          a.*,
          s.title,
          s.description,
          s.shift_date,
          s.start_time,
          s.end_time,
          s.location,
          s.city,
          s.hourly_wage,
          b.business_name,
          b.business_type
         FROM applications a
         JOIN shifts s ON a.shift_id = s.id
         JOIN businesses b ON s.business_id = b.id
         WHERE a.worker_id = $1
         ORDER BY a.applied_at DESC`,
        [req.user.id]
      );

      res.json({ applications: result.rows });
    } catch (error) {
      console.error('Get my applications error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Accept/reject application (business only)
router.patch('/:id',
  authenticate,
  authorize('business'),
  [
    body('status').isIn(['accepted', 'rejected']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      // Get application with shift info
      const appResult = await pool.query(
        `SELECT a.*, s.*, b.user_id as business_user_id
         FROM applications a
         JOIN shifts s ON a.shift_id = s.id
         JOIN businesses b ON s.business_id = b.id
         WHERE a.id = $1`,
        [id]
      );

      if (appResult.rows.length === 0) {
        return res.status(404).json({ message: 'Application not found' });
      }

      const application = appResult.rows[0];

      // Verify ownership
      if (application.business_user_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Check if shift is full
      if (status === 'accepted') {
        const filledResult = await pool.query(
          'SELECT COUNT(*) as count FROM applications WHERE shift_id = $1 AND status = $2',
          [application.shift_id, 'accepted']
        );
        const filled = parseInt(filledResult.rows[0].count);
        if (filled >= application.number_of_positions) {
          return res.status(400).json({ message: 'Shift is already full' });
        }
      }

      // Update application
      const updateResult = await pool.query(
        `UPDATE applications 
         SET status = $1, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );

      // If accepted, create shift assignment
      if (status === 'accepted') {
        await pool.query(
          `INSERT INTO shift_assignments (shift_id, worker_id, application_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (shift_id, worker_id) DO NOTHING`,
          [application.shift_id, application.worker_id, id]
        );

        // Check if shift should be marked as filled
        const filledResult = await pool.query(
          'SELECT COUNT(*) as count FROM applications WHERE shift_id = $1 AND status = $2',
          [application.shift_id, 'accepted']
        );
        const filled = parseInt(filledResult.rows[0].count);
        if (filled >= application.number_of_positions) {
          await pool.query(
            'UPDATE shifts SET status = $1 WHERE id = $2',
            ['filled', application.shift_id]
          );
        }

        // Notify worker
        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id)
           VALUES ($1, 'application_accepted', 'Application Accepted', 'Your application has been accepted!', 'application', $2)`,
          [application.worker_id, id]
        );
      } else {
        // Notify worker of rejection
        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id)
           VALUES ($1, 'application_rejected', 'Application Rejected', 'Your application has been rejected', 'application', $2)`,
          [application.worker_id, id]
        );
      }

      res.json({ application: updateResult.rows[0] });
    } catch (error) {
      console.error('Update application error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;



