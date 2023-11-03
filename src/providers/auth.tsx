"use client";

import AuthCheck from "@/utils/authCheck";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

export const AuthProvider = ({ children }: SessionProviderProps) => {
  return (
    <SessionProvider>
      <AuthCheck>{children}</AuthCheck>
    </SessionProvider>
  );
};
