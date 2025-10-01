const express = require('express')

// Controllers
const {
  register,
  login,
  update,
  deleteUser,
  getCurrentUser,
  getUserById,
} = require('../controllers/UserController')

// Middlewares
const { imageUpload } = require('../middlewares/imageUpload')
const authGuard = require('../middlewares/authGuard')
const validate = require('../middlewares/handleValidation')
const {
  registerValidation,
  loginValidation,
  updateValidation,
} = require('../middlewares/userValidations')

// Routes
const router = express.Router()
router.post('/register', registerValidation(), validate, register)
router.post('/login', loginValidation(), validate, login)
router.get('/profile', authGuard, getCurrentUser)
router.get('/:id', authGuard, getUserById)
router.patch(
  '/',
  authGuard,
  imageUpload.single('profilePhoto'),
  updateValidation(),
  validate,
  update
)
router.delete('/', authGuard, deleteUser)

module.exports = router
