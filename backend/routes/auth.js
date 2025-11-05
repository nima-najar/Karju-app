const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('userType').isIn(['worker', 'business']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName, phone, userType } = req.body;

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, first_name, last_name, user_type, verification_status`,
        [email, passwordHash, firstName, lastName, phone || null, userType]
      );

      const user = result.rows[0];

      // Create profile based on user type
      if (userType === 'worker') {
        await pool.query(
          'INSERT INTO worker_profiles (user_id) VALUES ($1)',
          [user.id]
        );
      } else if (userType === 'business') {
        await pool.query(
          'INSERT INTO businesses (user_id, business_name) VALUES ($1, $2)',
          [user.id, `${firstName} ${lastName}`]
        );
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type,
          verificationStatus: user.verification_status,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Get user
      const result = await pool.query(
        'SELECT id, email, password_hash, first_name, last_name, user_type, verification_status FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Check password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type,
          verificationStatus: user.verification_status,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;

    // Get additional profile data
    if (user.user_type === 'worker') {
      const profileResult = await pool.query(
        'SELECT * FROM worker_profiles WHERE user_id = $1',
        [user.id]
      );
      user.profile = profileResult.rows[0] || null;
    } else if (user.user_type === 'business') {
      const businessResult = await pool.query(
        'SELECT * FROM businesses WHERE user_id = $1',
        [user.id]
      );
      user.business = businessResult.rows[0] || null;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



