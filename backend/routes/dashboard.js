const express = require('express');
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Worker dashboard
router.get('/worker', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get upcoming shifts (accepted applications)
    const upcomingShifts = await pool.query(
      `SELECT 
        s.*,
        b.business_name,
        b.business_type,
        sa.status as assignment_status,
        a.status as application_status
       FROM shift_assignments sa
       JOIN shifts s ON sa.shift_id = s.id
       JOIN businesses b ON s.business_id = b.id
       LEFT JOIN applications a ON sa.application_id = a.id
       WHERE sa.worker_id = $1 
         AND sa.status = 'assigned'
         AND s.shift_date >= CURRENT_DATE
       ORDER BY s.shift_date ASC, s.start_time ASC`,
      [userId]
    );

    // Get pending applications
    const pendingApplications = await pool.query(
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
        b.business_name
       FROM applications a
       JOIN shifts s ON a.shift_id = s.id
       JOIN businesses b ON s.business_id = b.id
       WHERE a.worker_id = $1 
         AND a.status = 'pending'
         AND s.shift_date >= CURRENT_DATE
       ORDER BY a.applied_at DESC`,
      [userId]
    );

    // Get completed shifts
    const completedShifts = await pool.query(
      `SELECT 
        s.*,
        b.business_name,
        sa.hours_worked,
        sa.total_payment,
        sa.worker_payment,
        sa.status
       FROM shift_assignments sa
       JOIN shifts s ON sa.shift_id = s.id
       JOIN businesses b ON s.business_id = b.id
       WHERE sa.worker_id = $1 
         AND sa.status = 'completed'
       ORDER BY s.shift_date DESC
       LIMIT 10`,
      [userId]
    );

    // Get income stats
    const incomeStats = await pool.query(
      `SELECT 
        COALESCE(SUM(sa.worker_payment), 0) as total_earnings,
        COUNT(*) as total_shifts_completed
       FROM shift_assignments sa
       WHERE sa.worker_id = $1 AND sa.status = 'completed'`,
      [userId]
    );

    // Get monthly income
    const monthlyIncome = await pool.query(
      `SELECT 
        DATE_TRUNC('month', s.shift_date) as month,
        COALESCE(SUM(sa.worker_payment), 0) as earnings
       FROM shift_assignments sa
       JOIN shifts s ON sa.shift_id = s.id
       WHERE sa.worker_id = $1 
         AND sa.status = 'completed'
         AND s.shift_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months')
       GROUP BY DATE_TRUNC('month', s.shift_date)
       ORDER BY month DESC`,
      [userId]
    );

    res.json({
      upcomingShifts: upcomingShifts.rows,
      pendingApplications: pendingApplications.rows,
      completedShifts: completedShifts.rows,
      incomeStats: incomeStats.rows[0],
      monthlyIncome: monthlyIncome.rows,
    });
  } catch (error) {
    console.error('Worker dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Business dashboard
router.get('/business', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get business ID
    const businessResult = await pool.query(
      'SELECT id FROM businesses WHERE user_id = $1',
      [userId]
    );

    if (businessResult.rows.length === 0) {
      return res.status(404).json({ message: 'Business profile not found' });
    }

    const businessId = businessResult.rows[0].id;

    // Get active shifts
    const activeShifts = await pool.query(
      `SELECT 
        s.*,
        (SELECT COUNT(*) FROM applications WHERE shift_id = s.id AND status = 'accepted') as filled_positions,
        (SELECT COUNT(*) FROM applications WHERE shift_id = s.id AND status = 'pending') as pending_applications
       FROM shifts s
       WHERE s.business_id = $1 
         AND s.status IN ('open', 'filled')
         AND s.shift_date >= CURRENT_DATE
       ORDER BY s.shift_date ASC`,
      [businessId]
    );

    // Get recent applications
    const recentApplications = await pool.query(
      `SELECT 
        a.*,
        s.title,
        s.shift_date,
        s.start_time,
        u.first_name,
        u.last_name,
        wp.average_rating,
        wp.total_ratings
       FROM applications a
       JOIN shifts s ON a.shift_id = s.id
       JOIN users u ON a.worker_id = u.id
       LEFT JOIN worker_profiles wp ON wp.user_id = u.id
       WHERE s.business_id = $1
         AND a.status = 'pending'
       ORDER BY a.applied_at DESC
       LIMIT 10`,
      [businessId]
    );

    // Get completed shifts
    const completedShifts = await pool.query(
      `SELECT 
        s.*,
        COUNT(sa.id) as workers_count,
        SUM(sa.worker_payment) as total_worker_payments,
        SUM(sa.platform_fee) as total_platform_fees
       FROM shifts s
       LEFT JOIN shift_assignments sa ON sa.shift_id = s.id AND sa.status = 'completed'
       WHERE s.business_id = $1 
         AND s.status = 'completed'
       GROUP BY s.id
       ORDER BY s.shift_date DESC
       LIMIT 10`,
      [businessId]
    );

    // Get stats
    const stats = await pool.query(
      `SELECT 
        COUNT(DISTINCT s.id) as total_shifts,
        COUNT(DISTINCT a.id) as total_applications,
        COUNT(DISTINCT CASE WHEN a.status = 'accepted' THEN a.id END) as accepted_applications,
        COALESCE(SUM(sa.platform_fee), 0) as total_platform_fees_paid
       FROM shifts s
       LEFT JOIN applications a ON a.shift_id = s.id
       LEFT JOIN shift_assignments sa ON sa.shift_id = s.id AND sa.status = 'completed'
       WHERE s.business_id = $1`,
      [businessId]
    );

    res.json({
      activeShifts: activeShifts.rows,
      recentApplications: recentApplications.rows,
      completedShifts: completedShifts.rows,
      stats: stats.rows[0],
    });
  } catch (error) {
    console.error('Business dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



