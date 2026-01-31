const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/auth.middleware');
const {
  createJob,
  getAllJobs,
  getJobsByEmail,
  deleteJob
} = require('../controllers/jobs.controller');

// 🌍 PUBLIC: Get all jobs (for map)
router.get('/', getAllJobs);

// 👤 PUBLIC: Get jobs by contact email (My Jobs – V1)
router.get('/my-jobs', getJobsByEmail);

// 🔒 PROTECTED: Create a new job
router.post('/', authenticateToken, createJob);

// 🗑️ PUBLIC (email-verified): Delete job by ID
router.delete('/:id', deleteJob);

module.exports = router;