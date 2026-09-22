"use client";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>
  ) : (
    content
  );
}
