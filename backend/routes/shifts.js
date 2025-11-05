const express = require('express');
const { body, validationResult, query } = require('express-validator');
const pool = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const PLATFORM_FEE = parseInt(process.env.PLATFORM_FEE_PER_HOUR || '200000');

// Get all shifts (with filters)
router.get('/',
  [
    query('industry').optional().isIn(['hospitality', 'events', 'logistics', 'retail', 'other']),
    query('city').optional().isString(),
    query('minWage').optional().isInt(),
    query('maxWage').optional().isInt(),
    query('dateFrom').optional().isISO8601(),
    query('dateTo').optional().isISO8601(),
    query('status').optional().isIn(['open', 'filled', 'completed', 'cancelled']),
  ],
  async (req, res) => {
    try {
      const { industry, city, minWage, maxWage, dateFrom, dateTo, status } = req.query;

      let query = `
        SELECT 
          s.*,
          b.business_name,
          b.business_type,
          b.city as business_city,
          (SELECT COUNT(*) FROM applications WHERE shift_id = s.id AND status = 'accepted') as filled_positions,
          (SELECT COUNT(*) FROM applications WHERE shift_id = s.id AND status = 'pending') as pending_applications,
          (SELECT COUNT(*) FROM applications WHERE shift_id = s.id) as total_applications
        FROM shifts s
        JOIN businesses b ON s.business_id = b.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 0;

      if (industry) {
        paramCount++;
        query += ` AND s.industry = $${paramCount}`;
        params.push(industry);
      }

      if (city) {
        paramCount++;
        query += ` AND s.city = $${paramCount}`;
        params.push(city);
      }

      if (minWage) {
        paramCount++;
        query += ` AND s.hourly_wage >= $${paramCount}`;
        params.push(minWage);
      }

      if (maxWage) {
        paramCount++;
        query += ` AND s.hourly_wage <= $${paramCount}`;
        params.push(maxWage);
      }

      if (dateFrom) {
        paramCount++;
        query += ` AND s.shift_date >= $${paramCount}`;
        params.push(dateFrom);
      }

      if (dateTo) {
        paramCount++;
        query += ` AND s.shift_date <= $${paramCount}`;
        params.push(dateTo);
      }

      if (status) {
        paramCount++;
        query += ` AND s.status = $${paramCount}`;
        params.push(status);
      } else if (!req.query.all) {
        // Only show open shifts by default, unless 'all' parameter is provided
        query += ` AND s.status = 'open'`;
      }

      query += ` ORDER BY s.shift_date ASC, s.start_time ASC`;

      const result = await pool.query(query, params);

      // Add application status if user is logged in
      const shifts = result.rows;
      if (req.user) {
        for (let shift of shifts) {
          const appResult = await pool.query(
            'SELECT status FROM applications WHERE shift_id = $1 AND worker_id = $2',
            [shift.id, req.user.id]
          );
          shift.userApplication = appResult.rows[0] || null;
        }
      }

      res.json({ shifts });
    } catch (error) {
      console.error('Get shifts error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get single shift
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        s.*,
        b.business_name,
        b.business_type,
        b.address as business_address,
        b.city as business_city,
        b.province as business_province,
        b.phone as business_phone,
        (SELECT AVG(rating) FROM ratings r 
         JOIN shift_assignments sa ON sa.id = r.shift_assignment_id 
         WHERE sa.shift_id = s.id AND r.rating_type = 'business') as business_rating
       FROM shifts s
       JOIN businesses b ON s.business_id = b.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    const shift = result.rows[0];

    // Get application count
    const appCountResult = await pool.query(
      'SELECT COUNT(*) as count FROM applications WHERE shift_id = $1 AND status = $2',
      [id, 'accepted']
    );
    shift.filled_positions = parseInt(appCountResult.rows[0].count);

    // Get user application if logged in
    if (req.user && req.user.user_type === 'worker') {
      const userAppResult = await pool.query(
        'SELECT * FROM applications WHERE shift_id = $1 AND worker_id = $2',
        [id, req.user.id]
      );
      shift.userApplication = userAppResult.rows[0] || null;
    }

    res.json({ shift });
  } catch (error) {
    console.error('Get shift error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create shift (business only)
router.post('/',
  authenticate,
  authorize('business'),
  [
    body('title').notEmpty().trim(),
    body('description').notEmpty(),
    body('industry').isIn(['hospitality', 'events', 'logistics', 'retail', 'other']),
    body('location').notEmpty(),
    body('city').notEmpty(),
    body('shiftDate').isISO8601(),
    body('startTime').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    body('endTime').matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
    body('hourlyWage').isInt({ min: 0 }),
    body('numberOfPositions').isInt({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        industry,
        location,
        city,
        province,
        shiftDate,
        startTime,
        endTime,
        hourlyWage,
        numberOfPositions,
        requiredSkills,
        dressCode,
        cancellationDeadlineHours,
      } = req.body;

      // Get business ID
      const businessResult = await pool.query(
        'SELECT id FROM businesses WHERE user_id = $1',
        [req.user.id]
      );

      if (businessResult.rows.length === 0) {
        return res.status(404).json({ message: 'Business profile not found' });
      }

      const businessId = businessResult.rows[0].id;

      // Create shift
      const result = await pool.query(
        `INSERT INTO shifts (
          business_id, title, description, industry, location, city, province,
          shift_date, start_time, end_time, hourly_wage, number_of_positions,
          required_skills, dress_code, cancellation_deadline_hours
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *`,
        [
          businessId,
          title,
          description,
          industry,
          location,
          city,
          province || null,
          shiftDate,
          startTime,
          endTime,
          hourlyWage,
          numberOfPositions,
          requiredSkills || [],
          dressCode || null,
          cancellationDeadlineHours || 48,
        ]
      );

      const shift = result.rows[0];

      res.status(201).json({ shift });
    } catch (error) {
      console.error('Create shift error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update shift (business only)
router.put('/:id',
  authenticate,
  authorize('business'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check ownership
      const shiftResult = await pool.query(
        'SELECT s.* FROM shifts s JOIN businesses b ON s.business_id = b.id WHERE s.id = $1 AND b.user_id = $2',
        [id, req.user.id]
      );

      if (shiftResult.rows.length === 0) {
        return res.status(404).json({ message: 'Shift not found or unauthorized' });
      }

      // Build update query
      const allowedFields = [
        'title', 'description', 'location', 'city', 'province',
        'shift_date', 'start_time', 'end_time', 'hourly_wage',
        'number_of_positions', 'required_skills', 'dress_code',
        'cancellation_deadline_hours', 'status'
      ];

      const updateFields = [];
      const values = [];
      let paramCount = 0;

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          paramCount++;
          updateFields.push(`${field} = $${paramCount}`);
          values.push(updates[field]);
        }
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No valid fields to update' });
      }

      paramCount++;
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      paramCount++;
      values.push(id);

      const query = `UPDATE shifts SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
      const result = await pool.query(query, values);

      res.json({ shift: result.rows[0] });
    } catch (error) {
      console.error('Update shift error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete shift (business only, or admin)
router.delete('/:id',
  authenticate,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if shift exists
      const shiftResult = await pool.query(
        `SELECT s.*, b.user_id as business_user_id 
         FROM shifts s 
         JOIN businesses b ON s.business_id = b.id 
         WHERE s.id = $1`,
        [id]
      );

      if (shiftResult.rows.length === 0) {
        return res.status(404).json({ message: 'Shift not found' });
      }

      const shift = shiftResult.rows[0];

      // Check ownership or admin (for now, allow if business owner)
      // In production, you'd check for admin role
      if (req.user.user_type === 'business' && shift.business_user_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to delete this shift' });
      }

      // Check if shift has accepted applications
      const appResult = await pool.query(
        'SELECT COUNT(*) as count FROM applications WHERE shift_id = $1 AND status = $2',
        [id, 'accepted']
      );

      if (parseInt(appResult.rows[0].count) > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete shift with accepted applications. Cancel it instead.' 
        });
      }

      // Delete shift (cascade will handle related records)
      await pool.query('DELETE FROM shifts WHERE id = $1', [id]);

      res.json({ message: 'Shift deleted successfully' });
    } catch (error) {
      console.error('Delete shift error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;



