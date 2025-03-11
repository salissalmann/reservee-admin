"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "@/app/_utils/context-management/user-context";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/app/_utils/redux/store";
import { persistor } from "@/app/_utils/redux/store";
import { AuthProvider } from "./initial-load";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate 
        loading={null} 
        persistor={persistor}
      >
        <UserProvider>
          <AuthProvider>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </GoogleOAuthProvider>
          </AuthProvider>
        </UserProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
