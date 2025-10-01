// Utils
import { api, requestConfig } from '../utils/config'

// Publish Post
const publishPost = async (data, token) => {
  // Create Post Config with Data, Token and Image
  const config = requestConfig('POST', data, token, true)

  // Fetch Request
  try {
    const res = await fetch(api + '/posts', config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Update Post
const updatePost = async (data, id, token) => {
  // Create Patch Config with Data and Token
  const config = requestConfig('PATCH', data, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/posts/' + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Delete Post
const deletePost = async (id, token) => {
  // Create Delete Config with No Data and Token
  const config = requestConfig('DELETE', null, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/posts/' + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get All Posts
const getAllPosts = async (token) => {
  // Create Get Config with No Data and Token
  const config = requestConfig('GET', null, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/posts', config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get All User Posts
const getAllUserPosts = async (id, token) => {
  // Create Get Config with No Data and Token
  const config = requestConfig('GET', null, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/posts/user/' + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Get Post by ID
const getPost = async (id, token) => {
  // Create Get Config with No Data and Token
  const config = requestConfig('GET', null, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/posts/' + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Search Posts
const searchPosts = async (query, token) => {
  // Create Get Config with No Data and Token
  const config = requestConfig('GET', null, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/posts/search?q=' + query, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Like and Unlike Post
const likeUnlikePost = async (id, token) => {
  // Create Patch Config with No Data and Token
  const config = requestConfig('PATCH', null, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/posts/likeUnlike/' + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Comment Post
const commentPost = async (data, id, token) => {
  // Create Patch Config with Data and Token
  const config = requestConfig('PATCH', data, token)

  // Fetch Request
  try {
    const res = await fetch(api + '/posts/comment/' + id, config)
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

// Delete Comment Post
const deleteCommentPost = async (postId, commentId, token) => {
  // Create Delete Config with No Data and Token
  const config = requestConfig('DELETE', null, token)

  // Fetch Request
  try {
    const res = await fetch(
      api + `/posts/comment/${postId}/${commentId}`,
      config
    )
      .then((res) => res.json())
      .catch((err) => err)

    return res
  } catch (error) {
    console.log(error)
  }
}

const postservice = {
  publishPost,
  updatePost,
  deletePost,
  getAllPosts,
  getAllUserPosts,
  getPost,
  searchPosts,
  likeUnlikePost,
  commentPost,
  deleteCommentPost,
}

export default postservice
