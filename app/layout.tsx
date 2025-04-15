import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/layout/main-nav"
import { Toaster } from "@/components/ui/toaster"
import { StoreProvider } from "@/lib/store"
import { AuthProvider } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VetEquine CRM",
  description: "Sistema de gestión para veterinarios equinos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <StoreProvider>
              <div className="flex min-h-screen flex-col">
                <MainNav />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'