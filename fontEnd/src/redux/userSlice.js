import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: {
      allUsers: null,
      isFetching: false,
      error: false,
    },
    msg: "",
  },
  reducers: {
    getUsersStart: (state) => {
      state.users.isFetching = true;
    },
    getUsersSuccess: (state, action) => {
      state.users.isFetching = false;
      state.users.allUsers = action.payload.users;
    },
    getUsersFailed: (state) => {
      state.users.isFetching = false;
      state.users.error = true;
    },

    // DELETE
    DeleteUserStart: (state) => {
      state.users.isFetching = true;
    },
    DeleteUserSuccess: (state, action) => {
      state.users.isFetching = false;
      state.msg = action.payload;
    },
    DeleteUserFaild: (state, action) => {
      state.users.isFetching = false;
      state.users.error = true;
      state.msg = action.payload;
    },

    // UPDATE USER
    updateUserStart: (state) => {
      state.users.isFetching = true;
    },
    updateUserSuccess: (state, action) => {
      state.users.isFetching = false;
      state.msg = action.payload;
    },
    updateUserFailed: (state, action) => {
      state.users.isFetching = false;
      state.users.error = true;
      state.msg = action.payload;
    },

    // RESTORE USER
    restoreUserStart: (state) => {
      state.users.isFetching = true;
    },
    restoreUserSuccess: (state, action) => {
      state.users.isFetching = false;
      state.msg = action.payload;
      // Có thể update lại danh sách user nếu muốn ở đây!
    },
    restoreUserFailed: (state) => {
      state.users.isFetching = false;
      state.users.error = true;
    },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailed,
  DeleteUserStart,
  DeleteUserSuccess,
  DeleteUserFaild,
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  restoreUserStart,
  restoreUserSuccess,
  restoreUserFailed,
  clearUserList,
} = userSlice.actions;

export default userSlice.reducer;
