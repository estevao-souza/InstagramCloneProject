const { body } = require('express-validator')

// Publish Post Validation
const publishPostValidation = () => {
  return [
    body('title')
      .not()
      .equals('undefined')
      .withMessage('Title is a required field')
      .isString()
      .withMessage('Title is a required field')
      .isLength({ min: 3 })
      .withMessage('Title must have at least 3 characters'),
    body('photo').custom((_, { req }) => {
      if (!req.file) {
        throw new Error('Photo is a required field')
      }
      return true
    }),
  ]
}

// Update Post Validation
const updatePostValidation = () => {
  return [
    body('title')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Title must have at least 3 characters'),
  ]
}

// Insert Comment Validation
const insertCommentValidation = () => {
  return [body('comment').isString().withMessage('Comment is a required field')]
}

module.exports = {
  publishPostValidation,
  updatePostValidation,
  insertCommentValidation,
}
