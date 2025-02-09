"use client"; // Ensure this is a client-side component

import { SessionProvider } from "next-auth/react";
import SignInBtn from "./signinButton";

export default function SessionWrapper() {
  return (
    <SessionProvider>
      <SignInBtn />
    </SessionProvider>
  );
}