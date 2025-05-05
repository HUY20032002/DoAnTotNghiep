import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: user ? user : null,
      isFetching: false,
      error: false,
    },

    register: {
      isFetching: false,
      error: false,
      success: false,
    },

    forgotPassword: {
      isFetching: false,
      error: false,
      success: false,
    },
  },
  reducers: {
    // login
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.error = false;
    },
    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    // register
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },
    // Logout
    logoutStart: (state) => {
      state.login.isFetching = true;
    },
    logoutSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = null;
      state.login.error = false;
    },
    logoutFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
    // ForgotPassword
    forgotPasswordStart: (state) => {
      state.forgotPassword.isFetching = true;
    },
    forgotPasswordSuccess: (state) => {
      state.forgotPassword.isFetching = false;
      state.forgotPassword.error = false;
      state.forgotPassword.success = true;
    },
    forgotPasswordFailed: (state) => {
      state.forgotPassword.isFetching = false;
      state.forgotPassword.error = true;
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  registerFailed,
  registerSuccess,
  registerStart,
  logoutFailed,
  logoutSuccess,
  logoutStart,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailed,
} = authSlice.actions;
export default authSlice.reducer;
