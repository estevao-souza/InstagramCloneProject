// Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Service
import authService from '../services/authService'

// Get User from Local Storage
const user = JSON.parse(localStorage.getItem('user'))

// Set Initial States
const initialState = {
  user: user ? user : null,
  loading: false,
  success: false,
  error: null,
  message: null,
}

// Register and Login User
export const register = createAsyncThunk(
  'auth/register',
  async (formUser, thunkAPI) => {
    // Call Service
    const data = await authService.register(formUser)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Login User
export const login = createAsyncThunk(
  'auth/login',
  async (formUser, thunkAPI) => {
    // Call Service
    const data = await authService.login(formUser)

    // Check Errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0])
    }

    return data
  }
)

// Logout User
export const logout = createAsyncThunk('auth/logout', () => {
  authService.logout()
})

// Build Auth Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false
      state.success = false
      state.error = null
      state.message = null
    },
    resetUserAuth: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload
        state.user = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.success = true
        state.error = null
        state.user = null
        state.message = 'You have been signed out'
      })
  },
})

export const { reset, resetUserAuth } = authSlice.actions
export default authSlice.reducer
