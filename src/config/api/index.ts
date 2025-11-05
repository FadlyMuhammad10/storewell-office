import { logOut, setCredentials } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

interface CallAPIProps extends AxiosRequestConfig {
  token?: boolean;
  serverToken?: string;
  headers?: AxiosRequestHeaders;
}

// --- Buat instance axios ---
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API, // contoh: http://localhost:3000/api
  timeout: 5000,
});

// --- Tambahkan interceptor global (request) ---
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Tambahkan interceptor global (response) ---
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika token expired dan belum dicoba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/refresh-token`,
          {
            refreshToken,
          }
        );

        const newAccessToken = res.data.accessToken;
        Cookies.set("token", newAccessToken);

        store.dispatch(
          setCredentials({
            user: store.getState().auth.user,
            token: newAccessToken,
            refreshToken: res.data.refreshToken,
          })
        );

        // Update header dan ulang request sebelumnya
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        console.error(err);
        store.dispatch(logOut());
        // Hapus semua token dan redirect ke login
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default async function CallAPI({
  url,
  method,
  data,
  headers,
  serverToken,
}: CallAPIProps) {
  try {
    const finalHeaders = { ...headers };

    // Kalau token dari server-side (misal SSR)
    if (serverToken) {
      finalHeaders.Authorization = `Bearer ${serverToken}`;
    }

    const response = await instance.request({
      url,
      method,
      data,
      headers: finalHeaders,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || { message: "Request failed" };
    }

    return { message: "Unexpected error occurred" };
  }
}
