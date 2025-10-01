const bcrypt = require('bcryptjs')

// Generate Password Hash
const generatePasswordHash = async (password) => {
  const salt = await bcrypt.genSalt()
  return await bcrypt.hash(password, salt)
}

// Check if Passwords Match
const doPasswordsMatch = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword)
}

module.exports = { generatePasswordHash, doPasswordsMatch }
