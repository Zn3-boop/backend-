import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  token: null,
  isAuthenticated: false,
  role: null, // 'admin' | 'service' | null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
    },
  },
});

export const { setUserInfo, setToken, setRole, logout } = userSlice.actions;

export default userSlice.reducer;
