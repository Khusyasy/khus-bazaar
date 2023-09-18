"use client"

import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from "@material-tailwind/react"

export const metadata: Metadata = {
  title: 'Khus Bazaar',
  description: 'Ecommerce website for your programming needs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
