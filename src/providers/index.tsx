"use client";
import { ReactNode } from "react";
import { AuthProvider } from "./auth";
import UserProvider from "./user";
import { Toaster } from "react-hot-toast";
import TaskProvider from "./task";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <TaskProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </TaskProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default Providers;
