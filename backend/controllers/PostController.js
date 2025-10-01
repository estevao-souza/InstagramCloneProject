const Post = require('../models/Post')

// Helpers
const { imageRemoval } = require('../helpers/images-storage-manager')

// Main Operation: Publish Post
const publishPost = async (req, res) => {
  // Get User Info from Token
  const user = req.user

  // Get Post Fields
  const { title } = req.body
  const photo = req.file.filename

  try {
    // Mongoose Operation: Create Post
    const post = await Post.create({
      title,
      photo,
      userName: user.name,
      userId: user._id,
    })

    // Successful Response: Post with Message
    res.status(201).json({ post, message: 'Post created successfully' })
  } catch (error) {
    // Remove Photo from Local Storage before Error Response
    imageRemoval('posts', photo)

    // Error Response
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Main Operation: Update Post
const updatePost = async (req, res) => {
  // Get User Info from Token
  const user = req.user

  // Get Post ID from URL
  const { id } = req.params

  // Get Title from Body
  const { title } = req.body

  try {
    // Mongoose Operation: Get Post by ID
    const post = await Post.findById(id)

    // Check if Post Exists
    if (!post) {
      res.status(404).json({ errors: ['Post not found'] })
      return
    }

    // Check if Post Belongs to User
    if (!post.userId.equals(user._id)) {
      res
        .status(403)
        .json({ errors: ['This post does not belong to the current user'] })
      return
    }

    // Update Title Changes
    if (title) {
      post.title = title
    }

    // Mongoose Operation: Update Post Changes
    await post.save()

    // Successful Response: Post with Message
    res.status(200).json({ post, message: 'Post updated successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Main Operation: Delete Post
const deletePostById = async (req, res) => {
  // Get User Info from Token
  const user = req.user

  // Get Post ID from URL
  const { id } = req.params

  try {
    // Mongoose Operation: Get Post by ID
    const post = await Post.findById(id)

    // Check if Post Exists
    if (!post) {
      res.status(404).json({ errors: ['Post not found'] })
      return
    }

    // Check if Post Belongs to User
    if (!post.userId.equals(user._id)) {
      res
        .status(403)
        .json({ errors: ['This post does not belong to the current user'] })
      return
    }

    // Mongoose Operation: Delete Post by ID
    await Post.findByIdAndDelete(post._id)

    // Remove Deleted Post Photo from Local Storage
    imageRemoval('posts', post.photo)

    // Successful Response: Deleted Post ID and Message
    res.status(200).json({ id: post._id, message: 'Post deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Main Operation: Get All Posts
const getAllPosts = async (req, res) => {
  try {
    // Mongoose Operation: Find All Posts and Sort
    const posts = await Post.find({})
      .sort([['createdAt', -1]])
      .exec()

    // Check if Posts Exist
    if (posts.length === 0) {
      res.status(200).json({ message: ['No posts found'] })
      return
    }

    // Successful Response: Posts
    res.status(200).json(posts)
  } catch (error) {
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Main Operation: Get All User Posts
const getAllUserPosts = async (req, res) => {
  // Get User ID from URL
  const { id } = req.params

  try {
    // Mongoose Operation: Find All User Posts and Sort
    const posts = await Post.find({ userId: id })
      .sort([['createdAt', -1]])
      .exec()

    // Check if Posts Exist
    if (posts.length === 0) {
      res.status(200).json({ message: ['No posts found for this user'] })
      return
    }

    // Successful Response: Posts
    res.status(200).json(posts)
  } catch (error) {
    res.status(404).json({ errors: ['Invalid User ID'] })
  }
}

// Main Operation: Get Post by ID
const getPostById = async (req, res) => {
  // Get Post ID from URL
  const { id } = req.params

  try {
    // Mongoose Operation: Get Post by ID
    const post = await Post.findById(id)

    // Check if Post Exists
    if (!post) {
      throw new Error()
    }

    // Successful Response: Post
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json({ errors: ['Post not found'] })
  }
}

// Main Operation: Like and Unlike Post
const likeUnlikePost = async (req, res) => {
  // Get User Info from Token
  const user = req.user

  // Get Post ID from URL
  const { id } = req.params

  try {
    // Mongoose Operation: Get Post by ID
    const post = await Post.findById(id)

    // Check if Post Exists
    if (!post) {
      res.status(404).json({ errors: ['Post not found'] })
      return
    }

    // If User Liked the Post then Unlike
    if (post.likes.includes(user._id)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== user._id.toString()
      )

      // Mongoose Operation: Update Post Changes
      await post.save()

      // Successful Response
      res.status(200).json({
        postId: id,
        userId: user._id,
        liked: false,
        message: 'Post was disliked',
      })

      // Else Put User ID on Likes Array
    } else {
      post.likes.push(user._id)

      // Mongoose Operation: Update Post Changes
      await post.save()

      // Successful Response
      res.status(200).json({
        postId: id,
        userId: user._id,
        liked: true,
        message: 'Post was liked',
      })
    }
  } catch (error) {
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Main Operation: Comment Post
const insertComment = async (req, res) => {
  // Get User Info from Token
  const user = req.user

  // Get Post ID from URL
  const { id } = req.params

  // Get Comment from Body
  const { comment } = req.body

  try {
    // Mongoose Operation: Get Post by ID
    const post = await Post.findById(id)

    // Check if Post Exists
    if (!post) {
      res.status(404).json({ errors: ['Post not found'] })
      return
    }

    // Create Comment Object and Insert on Array
    const userComment = {
      userId: user._id,
      comment,
    }
    post.comments.push(userComment)

    // Mongoose Operation: Update Post Changes
    await post.save()

    // Get Last Comment
    const savedComment = post.comments[post.comments.length - 1]

    // Successful Response
    res.status(200).json({
      comment: savedComment,
      message: 'Comment inserted successfully',
    })
  } catch (error) {
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Main Operation: Delete Comment Post
const deleteCommentById = async (req, res) => {
  // Get User Info from Token
  const user = req.user

  // Get Post and Comment IDs from URL
  const { postId } = req.params
  const { commentId } = req.params

  try {
    // Mongoose Operation: Get Post by ID
    const post = await Post.findOne({ _id: postId })

    // Check if Post Exists
    if (!post) {
      res.status(404).json({ errors: ['Post not found'] })
      return
    }

    // Get Current Comment
    const comment = post.comments.id(commentId)

    // Check if Comment Exists
    if (!comment) {
      res.status(404).json({ errors: ['Comment not found'] })
      return
    }

    // Check if Comment Belongs to User
    if (!comment.userId.equals(user._id)) {
      res
        .status(403)
        .json({ errors: ['This comment does not belong to the current user'] })
      return
    }

    // Mongoose Operation: Update Post with Deleted Comment
    await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: comment } }
    )

    // Successful Response: Deleted Comment ID and Message
    res
      .status(200)
      .json({ id: comment._id, message: 'Comment deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Main Operation: Search Posts
const searchPosts = async (req, res) => {
  // Get URL Parameter Query
  const { q } = req.query

  // Mongoose Operation: Get Posts by Query (Contains | Case Insensitive)
  const posts = await Post.find({ title: new RegExp(q, 'i') }).exec()

  // Successful Response
  res.status(200).json(posts)
}

module.exports = {
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
}
