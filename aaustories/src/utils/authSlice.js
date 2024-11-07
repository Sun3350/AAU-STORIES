// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://aau-stories-sever.vercel.app/api/users/admin-login', { username, password });
      localStorage.setItem('adminToken', response.data.token); // Store token in localStorage
      return response.data.token;
    } catch (error) {
      return rejectWithValue('Invalid username or password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('adminToken') || null, // Load token from localStorage if present
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null
  },
  reducers: {
    logout(state) {
      localStorage.removeItem('adminToken');
      state.token = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
