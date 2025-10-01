const User = require('../models/User')
const Post = require('../models/Post')

// Helpers
const { imageRemoval } = require('../helpers/images-storage-manager')
const generateUserToken = require('../helpers/generate-user-token')
const {
  generatePasswordHash,
  doPasswordsMatch,
} = require('../helpers/bcrypt-operations')

// Main Operation: Register and Login User
const register = async (req, res) => {
  // Get User Fields
  const { name, email, password } = req.body

  // Mongoose Operation: Check if User Exists
  const user = await User.findOne({ email })
  if (user) {
    res.status(422).json({ errors: ['Email already in use'] })
    return
  }

  // Bcrypt Operation: Generate Password Hash
  const passwordHash = await generatePasswordHash(password)

  try {
    // Mongoose Operation: Create User
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
    })

    // Successful Response: User with Token
    res.status(201).json({
      _id: newUser._id,
      token: generateUserToken(newUser._id),
    })
  } catch (error) {
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Main Operation: Login User
const login = async (req, res) => {
  // Get User Fields
  const { email, password } = req.body

  // Mongoose Operation: Check if User Exists
  const user = await User.findOne({ email })
  if (!user) {
    res.status(404).json({ errors: ['User not found'] })
    return
  }

  // Bcrypt Operation: Check if Passwords Match
  if (!(await doPasswordsMatch(password, user.password))) {
    res.status(422).json({ errors: ['Invalid Password'] })
    return
  }

  // Successful Response: User with Token
  res.status(200).json({
    _id: user._id,
    token: generateUserToken(user._id),
  })
}

// Main Operation: Update User
const update = async (req, res) => {
  // Get User Fields
  const { name, bio, password } = req.body

  // Get Photo File
  let profilePhoto = null
  if (req.file) {
    profilePhoto = req.file.filename
  }

  // Mongoose Operation: Get User by ID
  const reqUser = req.user
  const user = await User.findById(reqUser._id).select('-password')

  // Set Name if it has Changed
  if (name) {
    user.name = name
  }

  // Set User Bio if it has Changed
  if (bio) {
    user.bio = bio
  }

  // Set Password if it has Changed
  if (password) {
    // Generate Password Hash
    const passwordHash = await generatePasswordHash(password)
    user.password = passwordHash
  }

  // Set Profile Photo if it has Changed
  if (profilePhoto) {
    // Remove Old Photo from Local Storage before Setting the New One to User
    if (user.profilePhoto) {
      imageRemoval('users', user.profilePhoto)
    }
    user.profilePhoto = profilePhoto
  }

  try {
    // Mongoose Operation: Update User
    await user.save()

    // Delete Password Field Before the Response
    const userObj = user.toObject ? user.toObject() : { ...user }
    delete userObj.password

    // Successful Response: User with Message
    res
      .status(200)
      .json({ user: userObj, message: 'User updated successfully' })
  } catch (error) {
    // Remove Photo from Local Storage before Error Response
    if (profilePhoto) {
      imageRemoval('users', profilePhoto)
    }

    // Error Response
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Main Operation: Delete User
const deleteUser = async (req, res) => {
  // Get User Info from Token
  const user = req.user

  try {
    // Mongoose Operation: Delete User by ID
    await User.findByIdAndDelete(user._id)

    // Remove User Photo from Local Storage
    if (user.profilePhoto) {
      imageRemoval('users', user.profilePhoto)
    }

    // Mongoose Operation: Find All User Posts
    const posts = await Post.find({ userId: user._id })

    // Delete All User Posts
    if (posts) {
      for (const post of posts) {
        // Mongoose Operation: Delete Post by ID
        await Post.findByIdAndDelete(post._id)

        // Remove Deleted Post Photo from Local Storage
        imageRemoval('posts', post.photo)
      }
    }

    // Successful Response: Deleted User ID and Message
    res.status(200).json({
      id: user._id,
      message: 'User and all posts deleted successfully',
    })
  } catch (error) {
    res
      .status(500)
      .json({ errors: ['An error occurred, please try again later'] })
  }
}

// Get Current Logged User
const getCurrentUser = async (req, res) => {
  const user = req.user
  res.status(200).json(user)
}

// Get User by ID
const getUserById = async (req, res) => {
  // Get ID from URL
  const { id } = req.params

  try {
    // Mongoose Operation: Get User by ID
    const user = await User.findById(id).select('-password')

    // Check if User Exists
    if (!user) {
      throw new Error()
    }

    // Successful Response: User
    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ errors: ['Invalid User ID'] })
  }
}

module.exports = {
  register,
  login,
  update,
  deleteUser,
  getCurrentUser,
  getUserById,
}
