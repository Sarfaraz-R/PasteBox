// src/features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../config/axiosInstance';

// REGISTER
export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/signup', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

// LOGIN
export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/login', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logoutSession = createAsyncThunk('auth/logoutSession', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/logout');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Logout failed');
  }
});

export const getCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/auth/me');
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

export const refreshSession = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('/auth/refresh');
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

// updateUser
export const updateUser = createAsyncThunk('auth/updateUser', async ({ userId, username }, { rejectWithValue }) => {
  try {
 
    const res = await axiosInstance.put(`/users/user/${userId}`, {username});
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

// deleteUser
export const deleteUser = createAsyncThunk('auth/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/users/user/${userId}`);
    return userId;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

//getUser
export const getUser = createAsyncThunk('auth/getUser', async (userId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`users/user/${userId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});




