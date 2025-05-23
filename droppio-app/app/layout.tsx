"use client";

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { Providers } from "@/lib/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Droppio - Web3 Tipping Platform",
  description: "Support content creators with blockchain-powered tipping and earn exclusive badges",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
