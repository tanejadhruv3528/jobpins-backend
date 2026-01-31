const { query } = require('../config/db');

/**
 * Extract latitude and longitude from Google Maps URL
 * Supports URLs containing @lat,lng
 */
const extractLatLngFromGoogleMaps = (url) => {
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (!match) return null;

  return {
    latitude: parseFloat(match[1]),
    longitude: parseFloat(match[2])
  };
};

// 🔒 Create a new job (protected)
const createJob = async (req, res) => {
  try {
    const { title, description, maps_url, apply_url, contact_email } = req.body;
    const employer_id = req.user.id; // From JWT token

    // Validation: All fields required
    if (!title || !description || !maps_url || !apply_url || !contact_email) {
      return res.status(400).json({
        message:
          'All fields are required: title, description, Google Maps link, apply_url, contact_email'
      });
    }

    // Extract coordinates from Google Maps URL
    const coords = extractLatLngFromGoogleMaps(maps_url);

    if (!coords) {
      return res.status(400).json({
        message: 'Invalid Google Maps link. Please paste a valid location link.'
      });
    }

    const { latitude, longitude } = coords;

    // Validation: Coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        message: 'Latitude must be between -90 and 90'
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        message: 'Longitude must be between -180 and 180'
      });
    }

    // Insert job into database
    await query(
      `INSERT INTO jobs (employer_id, title, description, latitude, longitude, apply_url, contact_email)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        employer_id,
        title,
        description,
        latitude,
        longitude,
        apply_url,
        contact_email
      ]
    );

    res.status(201).json({
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({
      message: 'Server error during job creation'
    });
  }
};

// 🌍 Get all jobs (public – for map)
const getAllJobs = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title, description, latitude, longitude, apply_url, created_at
       FROM jobs
       ORDER BY created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fetch jobs error:', error);
    res.status(500).json({
      message: 'Server error fetching jobs'
    });
  }
};

// 👤 Get jobs by contact email (My Jobs – V1)
const getJobsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    const result = await query(
      `SELECT id, title, description, latitude, longitude, apply_url, created_at
       FROM jobs
       WHERE contact_email = $1
       ORDER BY created_at DESC`,
      [email]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fetch my jobs error:', error);
    res.status(500).json({
      message: 'Server error fetching employer jobs'
    });
  }
};

// 🗑️ Delete job by ID + email (V1 safe)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required to delete job'
      });
    }

    const result = await query(
      `DELETE FROM jobs
       WHERE id = $1 AND contact_email = $2`,
      [id, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'Job not found or not authorized'
      });
    }

    res.status(200).json({
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      message: 'Server error deleting job'
    });
  }
};

// ✅ EXPORT EVERYTHING USED BY ROUTES
module.exports = {
  createJob,
  getAllJobs,
  getJobsByEmail,
  deleteJob
};