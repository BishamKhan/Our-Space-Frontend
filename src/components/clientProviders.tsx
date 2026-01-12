// components/ClientProviders.tsx
"use client"

import { ReactNode } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "sonner"

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  )
}
