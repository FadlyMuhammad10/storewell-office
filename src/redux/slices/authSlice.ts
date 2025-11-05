import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  name: string;
  email: string;
}
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get("token") || null, // ambil dari cookie saat pertama kali load
  refreshToken: Cookies.get("refreshToken") || null,
  isLogin: !!Cookies.get("token"), // kalau ada token → sudah login
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isLogin = true;
      Cookies.set("token", action.payload.token, {
        expires: 7,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", action.payload.refreshToken, {
        expires: 7,
        sameSite: "strict",
      });
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isLogin = false;
      Cookies.remove("token");
      Cookies.remove("refreshToken");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
