// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser, updateUser, deleteUser, getUser, getCurrentUser, logoutSession, refreshSession } from './authThunk';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoggedIn: false,
    loading: true,
    initialized: false,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.initialized = true;
    },
    markAuthInitialized: (state) => {
      state.loading = false;
      state.initialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user || null;
        state.isLoggedIn = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;        
        state.user = action.payload.user;
        state.isLoggedIn = true;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload || 'Login failed';
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.payload || null;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(logoutSession.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.isLoggedIn = false;
      })
      .addCase(logoutSession.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.isLoggedIn = false;
      })
        // updateUser
      .addCase(updateUser.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(updateUser.fulfilled,(state,action)=>{
        state.loading=false;
        state.user=action.payload;
      })
        .addCase(updateUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.error || 'Update failed';
        })
        // deleteUser
        .addCase(deleteUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(deleteUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=null;
            state.isLoggedIn=false;
        })
        .addCase(deleteUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.error || 'Delete failed';
        })
        // getUser
        .addCase(getUser.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(getUser.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload;
        })
        .addCase(getUser.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.error || 'Get user failed';
        })
     

  }
});

export const { logoutUser, markAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
