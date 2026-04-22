import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: { email: string; name: string } | null;
}

const getStoredUser = () => {
  const stored = localStorage.getItem('user');
  if (!stored || stored === "undefined") return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
};

const initialState: AuthState = {
  token: localStorage.getItem('token') === "undefined" ? null : localStorage.getItem('token'),
  user: getStoredUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: { email: string; name: string } }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
