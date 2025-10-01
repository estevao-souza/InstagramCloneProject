const jwt = require('jsonwebtoken')

// Global Constant
const jwtSecret = process.env.JWT_SECRET

// JWT Operation: Generate User Token
const generateUserToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: '7d' })
}

module.exports = generateUserToken
