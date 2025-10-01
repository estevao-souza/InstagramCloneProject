const express = require('express')

// Controller
const {
  publishPost,
  updatePost,
  deletePostById,
  getAllPosts,
  getAllUserPosts,
  getPostById,
  likeUnlikePost,
  insertComment,
  deleteCommentById,
  searchPosts,
} = require('../controllers/PostController')

// Middlewares
const { imageUpload } = require('../middlewares/imageUpload')
const authGuard = require('../middlewares/authGuard')
const validate = require('../middlewares/handleValidation')
const {
  publishPostValidation,
  updatePostValidation,
  insertCommentValidation,
} = require('../middlewares/postValidation')

// Routes
const router = express.Router()
router.get('/', authGuard, getAllPosts)
router.get('/search', authGuard, searchPosts)
router.get('/user/:id', authGuard, getAllUserPosts)
router.get('/:id', authGuard, getPostById)
router.post(
  '/',
  authGuard,
  imageUpload.single('photo'),
  publishPostValidation(),
  validate,
  publishPost
)
router.patch('/likeUnlike/:id', authGuard, likeUnlikePost)
router.patch(
  '/comment/:id',
  authGuard,
  insertCommentValidation(),
  validate,
  insertComment
)
router.patch('/:id', authGuard, updatePostValidation(), validate, updatePost)
router.delete('/comment/:postId/:commentId', authGuard, deleteCommentById)
router.delete('/:id', authGuard, deletePostById)

module.exports = router
