const jwt = require('jsonwebtoken');

// Authenticate JWT token from Authorization header
const authenticateToken = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers['authorization'];
    
    // Check if header exists
    if (!authHeader) {
      return res.status(401).json({
        message: 'Access token required'
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'Invalid or expired token'
        });
      }

      // Attach decoded payload to request object
      req.user = decoded;
      
      // Continue to next middleware/route
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
};

module.exports = {
  authenticateToken
};
