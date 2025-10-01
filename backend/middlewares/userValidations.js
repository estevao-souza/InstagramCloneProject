const { body } = require('express-validator')

// Register Validation
const registerValidation = () => {
  return [
    body('name')
      .isString()
      .withMessage('Name is a required field')
      .isLength({ min: 3 })
      .withMessage('Name must have at least 3 characters'),
    body('email')
      .isString()
      .withMessage('Email is a required field')
      .isEmail()
      .withMessage('Enter a valid email'),
    body('password')
      .isString()
      .withMessage('Password is a required field')
      .isLength({ min: 8 })
      .withMessage('Password must have at least 8 characters'),
    body('confirmPassword')
      .isString()
      .withMessage('Password confirmation is a required field')
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error('Passwords must be the same')
        }
        return true
      }),
  ]
}

// Login Validation
const loginValidation = () => {
  return [
    body('email')
      .isString()
      .withMessage('Email is a required field')
      .isEmail()
      .withMessage('Enter a valid email'),
    body('password').isString().withMessage('Password is a required field'),
  ]
}

// Update Validation
const updateValidation = () => {
  return [
    body('name')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Name must have at least 3 characters'),
    body('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('Password must have at least 8 characters'),
    body('confirmPassword')
      .if(body('password').exists())
      .isLength({ min: 8 })
      .withMessage('Password confirmation must have at least 8 characters')
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error('Passwords must be the same')
        }
        return true
      }),
  ]
}

module.exports = {
  registerValidation,
  loginValidation,
  updateValidation,
}
