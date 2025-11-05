const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create rating
router.post('/',
  authenticate,
  [
    body('shiftAssignmentId').isUUID(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('ratingType').isIn(['worker', 'business']),
    body('reviewText').optional().isString().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { shiftAssignmentId, rating, ratingType, reviewText } = req.body;

      // Get shift assignment
      const assignmentResult = await pool.query(
        `SELECT sa.*, s.business_id, b.user_id as business_user_id
         FROM shift_assignments sa
         JOIN shifts s ON sa.shift_id = s.id
         JOIN businesses b ON s.business_id = b.id
         WHERE sa.id = $1 AND sa.status = 'completed'`,
        [shiftAssignmentId]
      );

      if (assignmentResult.rows.length === 0) {
        return res.status(404).json({ message: 'Shift assignment not found or not completed' });
      }

      const assignment = assignmentResult.rows[0];
      const raterId = req.user.id;

      // Determine ratee ID
      let rateeId;
      if (ratingType === 'worker') {
        // Business rating worker
        if (req.user.id !== assignment.business_user_id) {
          return res.status(403).json({ message: 'Only the business can rate the worker' });
        }
        rateeId = assignment.worker_id;
      } else {
        // Worker rating business
        if (req.user.id !== assignment.worker_id) {
          return res.status(403).json({ message: 'Only the worker can rate the business' });
        }
        rateeId = assignment.business_user_id;
      }

      // Check if already rated
      const existingRating = await pool.query(
        'SELECT id FROM ratings WHERE shift_assignment_id = $1 AND rater_id = $2 AND rating_type = $3',
        [shiftAssignmentId, raterId, ratingType]
      );

      if (existingRating.rows.length > 0) {
        return res.status(400).json({ message: 'Already rated this shift' });
      }

      // Create rating
      const result = await pool.query(
        `INSERT INTO ratings (shift_assignment_id, rater_id, ratee_id, rating_type, rating, review_text)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [shiftAssignmentId, raterId, rateeId, ratingType, rating, reviewText || null]
      );

      // Update average rating for worker or business
      if (ratingType === 'worker') {
        // Update worker profile
        const workerRatings = await pool.query(
          `SELECT AVG(rating) as avg_rating, COUNT(*) as count
           FROM ratings
           WHERE ratee_id = $1 AND rating_type = 'worker'`,
          [rateeId]
        );

        await pool.query(
          `UPDATE worker_profiles 
           SET average_rating = $1, total_ratings = $2
           WHERE user_id = $3`,
          [
            parseFloat(workerRatings.rows[0].avg_rating) || 0,
            parseInt(workerRatings.rows[0].count) || 0,
            rateeId,
          ]
        );
      } else {
        // Update business rating (could be stored in businesses table or calculated)
        // For now, we'll just store it in ratings
      }

      res.status(201).json({ rating: result.rows[0] });
    } catch (error) {
      console.error('Create rating error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get ratings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        r.*,
        u.first_name as rater_first_name,
        u.last_name as rater_last_name
       FROM ratings r
       JOIN users u ON r.rater_id = u.id
       WHERE r.ratee_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json({ ratings: result.rows });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



