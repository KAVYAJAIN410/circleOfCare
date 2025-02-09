'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

export const AuthProvider=({children})=>{
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    )
}