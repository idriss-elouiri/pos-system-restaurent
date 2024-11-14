import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

// Utility function to handle loading and error states
const setLoadingAndError = (state, loading, error) => {
  state.loading = loading;
  state.error = error;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Sign In Actions
    signInStart: (state) => {
      setLoadingAndError(state, true, null);
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      setLoadingAndError(state, false, null);
    },
    signInFailure: (state, action) => {
      setLoadingAndError(state, false, action.payload);
    },

    // Update User Actions
    updateStart: (state) => {
      setLoadingAndError(state, true, null);
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      setLoadingAndError(state, false, null);
    },
    updateFailure: (state, action) => {
      setLoadingAndError(state, false, action.payload);
    },

    // Delete User Actions
    deleteUserStart: (state) => {
      setLoadingAndError(state, true, null);
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      setLoadingAndError(state, false, null);
    },
    deleteUserFailure: (state, action) => {
      setLoadingAndError(state, false, action.payload);
    },

    // Sign Out Action
    signoutSuccess: (state) => {
      state.currentUser = null;
      setLoadingAndError(state, false, null);
    },
  },
});

// Exporting actions for use in components
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} = userSlice.actions;

// Default export of the reducer
export default userSlice.reducer;
