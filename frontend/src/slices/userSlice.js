// Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Service
import userService from '../services/userService'

// Set Initial States
const initialState = {
  user: {},
  loading: false,
  success: false,
  error: null,
  message: null,
}

// Get Current Logged User
export const profile = createAsyncThunk('user/profile', async (_, thunkAPI) => {
  // Get Token
  const token = thunkAPI.getState().auth.user.token

  // Call Service
  const data = await userService.profile(token)

  return data
})

// Update User
export const updateUser = createAsyncThunk(
  'user/update',
  async (user, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await userService.updateUser(user, token)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Delete User
export const deleteUser = createAsyncThunk(
  'user/delete',
  async (_, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await userService.deleteUser(token)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Get User by ID
export const getUserDetails = createAsyncThunk(
  'user/get',
  async (id, thunkAPI) => {
    // Get Token
    const token = thunkAPI.getState().auth.user.token

    // Call Service
    const data = await userService.getUserDetails(id, token)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Build User Slice
export const userSlice = createSlice({
  name: 'user',
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
      .addCase(profile.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.user = action.payload
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.user = action.payload.user
        state.message = action.payload.message
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.user = {}
        state.message = action.payload.message
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.user = action.payload
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
        state.user = {}
      })
  },
})

export const { reset, setError } = userSlice.actions
export default userSlice.reducer
