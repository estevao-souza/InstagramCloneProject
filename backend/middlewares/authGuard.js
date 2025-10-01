const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Global Constants
const jwtSecret = process.env.JWT_SECRET

const authGuard = async (req, res, next) => {
  // Get Token from Header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // Check if Header has a Token
  if (!token) {
    return res.status(401).json({ errors: ['Access denied'] })
  }

  // Check if Token is Valid
  try {
    // JWT Operation: Verify Token
    const verified = jwt.verify(token, jwtSecret)

    // Set User Object Data on Request to avoid DB Requests to get User Info
    req.user = await User.findById(verified.id).select('-password')

    // Continue
    next()
  } catch (error) {
    res.status(401).json({ errors: ['Invalid token'] })
  }
}

module.exports = authGuard
