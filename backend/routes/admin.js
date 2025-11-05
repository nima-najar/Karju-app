const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.user_type,
        u.verification_status,
        u.id_verified,
        u.cv_uploaded,
        u.work_permit_uploaded,
        u.created_at,
        u.updated_at
      FROM users u
      ORDER BY u.created_at DESC
    `);
    res.json({ count: result.rows.length, users: result.rows });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all businesses
router.get('/businesses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.*,
        u.email,
        u.first_name,
        u.last_name
      FROM businesses b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `);
    res.json({ count: result.rows.length, businesses: result.rows });
  } catch (error) {
    console.error('Admin get businesses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all worker profiles
router.get('/workers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        wp.*,
        u.email,
        u.first_name,
        u.last_name,
        u.verification_status
      FROM worker_profiles wp
      JOIN users u ON wp.user_id = u.id
      ORDER BY wp.created_at DESC
    `);
    res.json({ count: result.rows.length, workers: result.rows });
  } catch (error) {
    console.error('Admin get workers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all shifts
router.get('/shifts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        b.business_name,
        b.business_type,
        u.email as business_email,
        (SELECT COUNT(*) FROM applications WHERE shift_id = s.id) as total_applications,
        (SELECT COUNT(*) FROM applications WHERE shift_id = s.id AND status = 'accepted') as accepted_applications,
        (SELECT COUNT(*) FROM applications WHERE shift_id = s.id AND status = 'pending') as pending_applications
      FROM shifts s
      JOIN businesses b ON s.business_id = b.id
      JOIN users u ON b.user_id = u.id
      ORDER BY s.created_at DESC
    `);
    res.json({ count: result.rows.length, shifts: result.rows });
  } catch (error) {
    console.error('Admin get shifts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all applications
router.get('/applications', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        s.title as shift_title,
        s.shift_date,
        s.start_time,
        s.end_time,
        s.hourly_wage,
        b.business_name,
        u.first_name as worker_first_name,
        u.last_name as worker_last_name,
        u.email as worker_email
      FROM applications a
      JOIN shifts s ON a.shift_id = s.id
      JOIN businesses b ON s.business_id = b.id
      JOIN users u ON a.worker_id = u.id
      ORDER BY a.applied_at DESC
    `);
    res.json({ count: result.rows.length, applications: result.rows });
  } catch (error) {
    console.error('Admin get applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all shift assignments
router.get('/assignments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sa.*,
        s.title as shift_title,
        s.shift_date,
        s.start_time,
        s.end_time,
        b.business_name,
        u.first_name as worker_first_name,
        u.last_name as worker_last_name,
        u.email as worker_email
      FROM shift_assignments sa
      JOIN shifts s ON sa.shift_id = s.id
      JOIN businesses b ON s.business_id = b.id
      JOIN users u ON sa.worker_id = u.id
      ORDER BY sa.created_at DESC
    `);
    res.json({ count: result.rows.length, assignments: result.rows });
  } catch (error) {
    console.error('Admin get assignments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all ratings
router.get('/ratings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.*,
        rater.first_name as rater_first_name,
        rater.last_name as rater_last_name,
        rater.email as rater_email,
        ratee.first_name as ratee_first_name,
        ratee.last_name as ratee_last_name,
        ratee.email as ratee_email,
        s.title as shift_title
      FROM ratings r
      JOIN users rater ON r.rater_id = rater.id
      JOIN users ratee ON r.ratee_id = ratee.id
      LEFT JOIN shift_assignments sa ON r.shift_assignment_id = sa.id
      LEFT JOIN shifts s ON sa.shift_id = s.id
      ORDER BY r.created_at DESC
    `);
    res.json({ count: result.rows.length, ratings: result.rows });
  } catch (error) {
    console.error('Admin get ratings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all notifications
router.get('/notifications', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        n.*,
        u.email,
        u.first_name,
        u.last_name
      FROM notifications n
      JOIN users u ON n.user_id = u.id
      ORDER BY n.created_at DESC
      LIMIT 1000
    `);
    res.json({ count: result.rows.length, notifications: result.rows });
  } catch (error) {
    console.error('Admin get notifications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM users WHERE user_type = $1', ['worker']),
      pool.query('SELECT COUNT(*) as count FROM users WHERE user_type = $1', ['business']),
      pool.query('SELECT COUNT(*) as count FROM businesses'),
      pool.query('SELECT COUNT(*) as count FROM worker_profiles'),
      pool.query('SELECT COUNT(*) as count FROM shifts'),
      pool.query('SELECT COUNT(*) as count FROM shifts WHERE status = $1', ['open']),
      pool.query('SELECT COUNT(*) as count FROM shifts WHERE status = $1', ['filled']),
      pool.query('SELECT COUNT(*) as count FROM shifts WHERE status = $1', ['completed']),
      pool.query('SELECT COUNT(*) as count FROM applications'),
      pool.query('SELECT COUNT(*) as count FROM applications WHERE status = $1', ['pending']),
      pool.query('SELECT COUNT(*) as count FROM applications WHERE status = $1', ['accepted']),
      pool.query('SELECT COUNT(*) as count FROM shift_assignments'),
      pool.query('SELECT COUNT(*) as count FROM ratings'),
      pool.query('SELECT COUNT(*) as count FROM notifications'),
    ]);

    res.json({
      total_users: parseInt(stats[0].rows[0].count),
      workers: parseInt(stats[1].rows[0].count),
      businesses: parseInt(stats[2].rows[0].count),
      total_businesses: parseInt(stats[3].rows[0].count),
      worker_profiles: parseInt(stats[4].rows[0].count),
      total_shifts: parseInt(stats[5].rows[0].count),
      open_shifts: parseInt(stats[6].rows[0].count),
      filled_shifts: parseInt(stats[7].rows[0].count),
      completed_shifts: parseInt(stats[8].rows[0].count),
      total_applications: parseInt(stats[9].rows[0].count),
      pending_applications: parseInt(stats[10].rows[0].count),
      accepted_applications: parseInt(stats[11].rows[0].count),
      total_assignments: parseInt(stats[12].rows[0].count),
      total_ratings: parseInt(stats[13].rows[0].count),
      total_notifications: parseInt(stats[14].rows[0].count),
    });
  } catch (error) {
    console.error('Admin get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

