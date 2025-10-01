// Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Service
import postService from '../services/postService'

// Set Initial States
const initialState = {
  posts: [],
  post: {},
  loading: false,
  commenting: false,
  deletingComment: false,
  success: false,
  error: null,
  message: null,
}

// Publish Post
export const publishPost = createAsyncThunk(
  'post/publish',
  async (post, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.publishPost(post, token)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Update Post
export const updatePost = createAsyncThunk(
  'post/update',
  async (post, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.updatePost(
      { title: post.title },
      post.id,
      token
    )

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Delete Post
export const deletePost = createAsyncThunk(
  'post/delete',
  async (id, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.deletePost(id, token)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Get All Posts
export const getAllPosts = createAsyncThunk(
  'post/get-all',
  async (_, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.getAllPosts(token)

    return data
  }
)

// Get All User Posts
export const getAllUserPosts = createAsyncThunk(
  'post/user-posts',
  async (id, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.getAllUserPosts(id, token)

    return data
  }
)

// Get Post by ID
export const getPost = createAsyncThunk(
  'post/get-post',
  async (id, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.getPost(id, token)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Search Posts
export const searchPosts = createAsyncThunk(
  'post/search',
  async (query, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.searchPosts(query, token)

    return data
  }
)

// Like and Unlike Post
export const likeUnlikePost = createAsyncThunk(
  'post/like-unlike',
  async (id, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.likeUnlikePost(id, token)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Comment Post
export const commentPost = createAsyncThunk(
  'post/comment',
  async (post, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.commentPost(
      { comment: post.comment },
      post.id,
      token
    )

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Delete Comment Post
export const deleteCommentPost = createAsyncThunk(
  'post/delete-comment',
  async ({ postId, commentId }, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await postService.deleteCommentPost(postId, commentId, token)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Build Post Slice
export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false
      state.success = false
      state.error = null
      state.message = null
    },
    setError(state, action) {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPost.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(publishPost.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.post = action.payload.post
        if (!Array.isArray(state.posts)) {
          state.posts = [state.post]
        } else {
          state.posts.unshift(state.post)
        }
        state.message = action.payload.message
      })
      .addCase(publishPost.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
        state.post = {}
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.post = action.payload.post
        state.posts.map((post) => {
          if (post._id === action.payload.post._id) {
            return (post.title = action.payload.post.title)
          }
          return post
        })
        state.message = action.payload.message
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.posts = state.posts.filter((post) => {
          return post._id !== action.payload.id
        })
        state.message = action.payload.message
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
      })
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.posts = action.payload
      })
      .addCase(getAllUserPosts.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(getAllUserPosts.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.posts = action.payload
      })
      .addCase(getPost.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.post = action.payload
      })
      .addCase(getPost.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
      })
      .addCase(searchPosts.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.posts = action.payload
      })
      .addCase(likeUnlikePost.pending, (state) => {
        state.loading = false
        state.success = false
        state.error = null
      })
      .addCase(likeUnlikePost.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null

        // Update Individual Post
        if (state.post && state.post.likes) {
          if (action.payload.liked) {
            state.post.likes.push(action.payload.userId)
          } else {
            state.post.likes = state.post.likes.filter(
              (userId) => userId !== action.payload.userId
            )
          }
        }

        // Update Post in Post List
        state.posts = state.posts.map((post) => {
          if (post._id === action.payload.postId) {
            return {
              ...post,
              likes: action.payload.liked
                ? [...post.likes, action.payload.userId]
                : post.likes.filter(
                    (userId) => userId !== action.payload.userId
                  ),
            }
          }
          return post
        })
        state.message = action.payload.message
      })
      .addCase(likeUnlikePost.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
      })
      .addCase(commentPost.pending, (state) => {
        state.commenting = true
        state.success = false
        state.error = null
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        state.commenting = false
        state.success = true
        state.error = null
        state.post.comments.push(action.payload.comment)
        state.message = action.payload.message
      })
      .addCase(commentPost.rejected, (state, action) => {
        state.commenting = false
        state.success = false
        state.error = action.payload
      })
      .addCase(deleteCommentPost.pending, (state) => {
        state.deletingComment = true
        state.success = false
        state.error = null
      })
      .addCase(deleteCommentPost.fulfilled, (state, action) => {
        state.deletingComment = false
        state.success = true
        state.error = null
        state.post.comments = state.post.comments.filter((comment) => {
          return comment._id !== action.payload.id
        })
        state.message = action.payload.message
      })
      .addCase(deleteCommentPost.rejected, (state, action) => {
        state.deletingComment = false
        state.success = false
        state.error = action.payload
      })
  },
})

export const { reset, setError } = postSlice.actions
export default postSlice.reducer
