const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Register new employer
const register = async (req, res) => {
  try {
    const { email, password, company_name } = req.body;

    // Validation: All fields required
    if (!email || !password || !company_name) {
      return res.status(400).json({
        message: 'All fields are required: email, password, company_name'
      });
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Validation: Password minimum length
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if email already exists
    const existingEmployer = await query(
      'SELECT id FROM employers WHERE email = $1',
      [email]
    );

    if (existingEmployer.rows.length > 0) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert employer into database
    await query(
      'INSERT INTO employers (email, password_hash, company_name) VALUES ($1, $2, $3)',
      [email, password_hash, company_name]
    );

    // Success response
    res.status(201).json({
      message: 'Employer registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration'
    });
  }
};

// Login employer
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: Both fields required
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find employer by email
    const result = await query(
      'SELECT id, email, password_hash FROM employers WHERE email = $1',
      [email]
    );

    // If employer not found, return generic error (prevent email enumeration)
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const employer = result.rows[0];

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, employer.password_hash);

    // If password doesn't match, return generic error
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: employer.id,
        email: employer.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    // Success response with token
    res.status(200).json({
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login'
    });
  }
};

module.exports = {
  register,
  login
};
