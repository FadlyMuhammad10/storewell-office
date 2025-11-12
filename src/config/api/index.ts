import { logOut, setCredentials } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

interface CallAPIProps extends AxiosRequestConfig {
  token?: boolean;
  serverToken?: string;
  headers?: AxiosRequestHeaders;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// --- Buat instance axios ---
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API, // contoh: http://localhost:3000/api
  timeout: 5000,
  withCredentials: true,
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

      // Kalau sedang refresh token → tunggu dulu
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(instance(originalRequest));
          });
        });
      }

      // Jalankan refresh token
      isRefreshing = true;
      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/refresh-token`,
          { refreshToken },
          { withCredentials: true } // <== tambahkan ini
        );

        const newAccessToken = res.data.data.accessToken;
        Cookies.set("token", newAccessToken, {
          expires: 7,
          sameSite: "strict",
        });

        store.dispatch(
          setCredentials({
            token: newAccessToken,
            refreshToken,
            user: store.getState().auth.user,
            isLogin: true,
          })
        );

        onTokenRefreshed(newAccessToken);
        isRefreshing = false;

        // Update header dan ulang request sebelumnya
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        console.error(err);
        store.dispatch(logOut());
        // // Hapus semua token dan redirect ke login
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
