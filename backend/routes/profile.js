const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get worker profile
router.get('/worker/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const profileResult = await pool.query(
      `SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        wp.*
       FROM users u
       LEFT JOIN worker_profiles wp ON wp.user_id = u.id
       WHERE u.id = $1 AND u.user_type = 'worker'`,
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    // Get ratings
    const ratingsResult = await pool.query(
      `SELECT r.*, u.first_name as rater_first_name, u.last_name as rater_last_name
       FROM ratings r
       JOIN users u ON r.rater_id = u.id
       WHERE r.ratee_id = $1 AND r.rating_type = 'worker'
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json({
      profile: profileResult.rows[0],
      ratings: ratingsResult.rows,
    });
  } catch (error) {
    console.error('Get worker profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update worker profile
router.put('/worker',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.id;

      if (req.user.user_type !== 'worker') {
        return res.status(403).json({ message: 'Only workers can update worker profiles' });
      }

      const {
        bio,
        skills,
        experienceYears,
        preferredLocations,
        availabilityCalendar,
        profilePictureUrl,
      } = req.body;

      // Check if profile_picture_url column exists, if not we'll handle it
      // For now, we'll store it as a JSONB field or add it to the schema
      // Update profile
      const result = await pool.query(
        `UPDATE worker_profiles
         SET 
           bio = COALESCE($1, bio),
           skills = COALESCE($2, skills),
           experience_years = COALESCE($3, experience_years),
           preferred_locations = COALESCE($4, preferred_locations),
           availability_calendar = COALESCE($5, availability_calendar),
           updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $6
         RETURNING *`,
        [
          bio,
          skills,
          experienceYears,
          preferredLocations,
          availabilityCalendar ? JSON.stringify(availabilityCalendar) : null,
          userId,
        ]
      );
      
      // Update profile picture (can be null to remove)
      if (profilePictureUrl !== undefined) {
        await pool.query(
          `UPDATE worker_profiles 
           SET profile_picture_url = $1 
           WHERE user_id = $2`,
          [profilePictureUrl, userId]
        );
      }
      
      // Get updated profile with picture
      const updatedResult = await pool.query(
        'SELECT * FROM worker_profiles WHERE user_id = $1',
        [userId]
      );

      res.json({ profile: updatedResult.rows[0] || result.rows[0] });
    } catch (error) {
      console.error('Update worker profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update business profile
router.put('/business',
  authenticate,
  [
    body('businessName').optional().notEmpty(),
    body('businessType').optional().isIn(['hospitality', 'events', 'logistics', 'retail', 'other']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.id;

      if (req.user.user_type !== 'business') {
        return res.status(403).json({ message: 'Only businesses can update business profiles' });
      }

      const {
        businessName,
        businessType,
        registrationNumber,
        address,
        city,
        province,
        phone,
        website,
      } = req.body;

      const result = await pool.query(
        `UPDATE businesses
         SET 
           business_name = COALESCE($1, business_name),
           business_type = COALESCE($2, business_type),
           registration_number = COALESCE($3, registration_number),
           address = COALESCE($4, address),
           city = COALESCE($5, city),
           province = COALESCE($6, province),
           phone = COALESCE($7, phone),
           website = COALESCE($8, website),
           updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $9
         RETURNING *`,
        [
          businessName,
          businessType,
          registrationNumber,
          address,
          city,
          province,
          phone,
          website,
          userId,
        ]
      );

      res.json({ business: result.rows[0] });
    } catch (error) {
      console.error('Update business profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;



