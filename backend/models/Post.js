const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
  userId: mongoose.ObjectId,
  comment: String,
})

const postSchema = new Schema(
  {
    title: String,
    photo: String,
    userName: String,
    likes: Array,
    comments: [commentSchema],
    userId: mongoose.ObjectId,
  },
  {
    timestamps: true,
  }
)

const Post = mongoose.model('Post', postSchema)

module.exports = Post
