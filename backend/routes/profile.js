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
        u.phone,
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
        skills: skillsRaw,
        profilePictureUrl,
      } = req.body;
      const experienceYears = req.body.experienceYears ?? req.body.experience_years ?? null;
      const preferredLocationsRaw = req.body.preferredLocations ?? req.body.preferred_locations ?? null;
      const availabilityCalendarRaw = req.body.availabilityCalendar ?? req.body.availability_calendar ?? null;
      const certificatesRaw = req.body.certificates ?? null;

      const birthDate = req.body.birthDate || req.body.birth_date || null;
      const gender = req.body.gender || null;
      const nationalId = req.body.nationalId || req.body.national_id || null;
      const passportNumber = req.body.passportNumber || req.body.passport_number || null;
      const phoneNumber = req.body.phoneNumber || req.body.phone_number || null;
      const address = req.body.address || null;
      const city = req.body.city || null;
      const province = req.body.province || null;
      const bankAccountHolder = req.body.bankAccountHolder || req.body.bank_account_holder || null;
      const bankCardNumber = req.body.bankCardNumber || req.body.bank_card_number || null;
      const bankIban = req.body.bankIban || req.body.bank_iban || null;
      const phoneVerifiedRaw = req.body.phoneVerified ?? req.body.phone_verified ?? null;
      const militaryStatus = req.body.militaryStatus || req.body.military_status || null;
      const educationLevel = req.body.educationLevel || req.body.education_level || null;
      const educationField = req.body.educationField || req.body.education_field || null;
      const educationInstitution = req.body.educationInstitution || req.body.education_institution || null;
      const educationGraduationYear = req.body.educationGraduationYear || req.body.education_graduation_year || null;
      const aboutMe = req.body.aboutMe || req.body.about_me || null;
      const personalityTraits = req.body.personalityTraits || req.body.personality_traits || null;
      const languagesRaw = req.body.languages ?? null;
      const documentsRaw = req.body.documents ?? null;
      const preferencesRaw = req.body.preferences ?? null;
      const verificationProgress = req.body.verificationProgress ?? req.body.verification_progress ?? null;

      const normalizeText = (value) => {
        if (value === undefined || value === null) return null;
        if (typeof value === 'string' && value.trim() === '') return null;
        return value;
      };

      const skills = Array.isArray(skillsRaw)
        ? skillsRaw
        : typeof skillsRaw === 'string'
          ? skillsRaw
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : null;

      const preferredLocations = Array.isArray(preferredLocationsRaw)
        ? preferredLocationsRaw
        : typeof preferredLocationsRaw === 'string'
          ? preferredLocationsRaw
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : null;

      const availabilityCalendar = availabilityCalendarRaw
        ? JSON.stringify(availabilityCalendarRaw)
        : null;

      const certificates = certificatesRaw ? JSON.stringify(certificatesRaw) : null;

      const phoneVerified =
        phoneVerifiedRaw === null ? null : Boolean(phoneVerifiedRaw);

      let languages = null;
      if (Array.isArray(languagesRaw)) {
        const normalizedLanguages = languagesRaw
          .map((lang) => {
            if (typeof lang === 'string') {
              return {
                name: String(lang).trim(),
                level: '',
              };
            }
            return {
              name: lang?.name ? String(lang.name).trim() : '',
              level: lang?.level ? String(lang.level).trim() : '',
            };
          })
          .filter((lang) => lang.name);
        languages = JSON.stringify(normalizedLanguages);
      } else if (typeof languagesRaw === 'string' && languagesRaw.trim() !== '') {
        try {
          const parsed = JSON.parse(languagesRaw);
          if (Array.isArray(parsed)) {
            languages = JSON.stringify(
              parsed
                .map((lang) => ({
                  name: lang?.name ? String(lang.name).trim() : '',
                  level: lang?.level ? String(lang.level).trim() : '',
                }))
                .filter((lang) => lang.name)
            );
          }
        } catch (e) {
          languages = null;
        }
      }

      let documents = null;
      if (documentsRaw) {
        if (typeof documentsRaw === 'string') {
          documents = documentsRaw;
        } else {
          documents = JSON.stringify(documentsRaw);
        }
      }

      let preferences = null;
      if (preferencesRaw !== undefined && preferencesRaw !== null) {
        if (typeof preferencesRaw === 'string') {
          preferences = preferencesRaw;
        } else {
          preferences = JSON.stringify(preferencesRaw);
        }
      }

      // Ensure columns exist (in case migrations haven't run yet)
      await pool.query(
        `ALTER TABLE worker_profiles
         ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]',
         ADD COLUMN IF NOT EXISTS birth_date DATE,
         ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
         ADD COLUMN IF NOT EXISTS national_id VARCHAR(50),
         ADD COLUMN IF NOT EXISTS passport_number VARCHAR(50),
         ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50),
         ADD COLUMN IF NOT EXISTS address TEXT,
         ADD COLUMN IF NOT EXISTS city VARCHAR(100),
         ADD COLUMN IF NOT EXISTS province VARCHAR(100),
         ADD COLUMN IF NOT EXISTS bank_account_holder VARCHAR(150),
         ADD COLUMN IF NOT EXISTS bank_card_number VARCHAR(32),
         ADD COLUMN IF NOT EXISTS bank_iban VARCHAR(34),
         ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
         ADD COLUMN IF NOT EXISTS military_status VARCHAR(100),
         ADD COLUMN IF NOT EXISTS education_level VARCHAR(100),
         ADD COLUMN IF NOT EXISTS education_field VARCHAR(255),
         ADD COLUMN IF NOT EXISTS education_institution VARCHAR(255),
         ADD COLUMN IF NOT EXISTS education_graduation_year VARCHAR(10),
         ADD COLUMN IF NOT EXISTS about_me TEXT,
         ADD COLUMN IF NOT EXISTS personality_traits TEXT,
         ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb,
         ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb,
         ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb,
         ADD COLUMN IF NOT EXISTS verification_progress INTEGER DEFAULT 0`
      );

      const result = await pool.query(
        `UPDATE worker_profiles
         SET 
           bio = COALESCE($1, bio),
           skills = COALESCE($2, skills),
           experience_years = COALESCE($3, experience_years),
           preferred_locations = COALESCE($4, preferred_locations),
           availability_calendar = COALESCE($5::jsonb, availability_calendar),
           certificates = COALESCE($6::jsonb, certificates),
           birth_date = COALESCE($7::date, birth_date),
           gender = COALESCE($8, gender),
           national_id = COALESCE($9, national_id),
           passport_number = COALESCE($10, passport_number),
           phone_number = COALESCE($11, phone_number),
           address = COALESCE($12, address),
           city = COALESCE($13, city),
           province = COALESCE($14, province),
           bank_account_holder = COALESCE($15, bank_account_holder),
           bank_card_number = COALESCE($16, bank_card_number),
           bank_iban = COALESCE($17, bank_iban),
           phone_verified = COALESCE($18, phone_verified),
           military_status = COALESCE($19, military_status),
           education_level = COALESCE($20, education_level),
           education_field = COALESCE($21, education_field),
           education_institution = COALESCE($22, education_institution),
           education_graduation_year = COALESCE($23, education_graduation_year),
           about_me = COALESCE($24, about_me),
           personality_traits = COALESCE($25, personality_traits),
           languages = COALESCE($26::jsonb, languages),
           documents = COALESCE($27::jsonb, documents),
           preferences = COALESCE($28::jsonb, preferences),
           verification_progress = COALESCE($29, verification_progress),
           updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $30
         RETURNING *`,
        [
          bio ?? null,
          skills ?? null,
          experienceYears ?? null,
          preferredLocations ?? null,
          availabilityCalendar,
          certificates,
          normalizeText(birthDate),
          normalizeText(gender),
          normalizeText(nationalId),
          normalizeText(passportNumber),
          normalizeText(phoneNumber),
          normalizeText(address),
          normalizeText(city),
          normalizeText(province),
          normalizeText(bankAccountHolder),
          normalizeText(bankCardNumber),
          normalizeText(bankIban),
          phoneVerified,
          normalizeText(militaryStatus),
          normalizeText(educationLevel),
          normalizeText(educationField),
          normalizeText(educationInstitution),
          normalizeText(educationGraduationYear),
          normalizeText(aboutMe),
          normalizeText(personalityTraits),
          languages,
          documents,
          preferences,
          verificationProgress !== null ? Number(verificationProgress) : null,
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
      res.status(500).json({
        message: error?.message || 'Server error',
        detail: process.env.NODE_ENV === 'production' ? undefined : error?.stack,
      });
    }
  }
);

// Update business profile
router.put('/business',
  authenticate,
  [
    body('businessName').optional().notEmpty(),
    body('businessType').optional().isIn(['رستوران و پذیرایی', 'رویدادها', 'لجستیک', 'خرده‌فروشی', 'سایر']),
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



