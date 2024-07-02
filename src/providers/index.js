"use client";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "@/providers/SnackbarProvider"; // Import the SnackbarProvider from the new file

const Providers = (props) => {
  return (
    <SnackbarProvider>
      <SessionProvider>{props.children}</SessionProvider>
    </SnackbarProvider>
  );
};

export default Providers;
