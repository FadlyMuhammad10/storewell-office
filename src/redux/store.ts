import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cookieStorage from "./cookieStorage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  keyPrefix: "redux_", // biar cookie storage lebih aman
  storage: cookieStorage, // pakai js-cookie
  whitelist: ["auth"], // hanya auth yang dipersist
};

// Gabungkan semua reducer (kalau nanti tambah cart, product, dll)
const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // reducer: {
  //   auth: authReducer,
  // },

  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // penting buat persist
    }),
});

export const persistor = persistStore(store);

persistor.subscribe(() => {});

store.subscribe(() => {});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
