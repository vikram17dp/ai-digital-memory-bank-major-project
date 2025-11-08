import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import "./globals-theme.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"],
  preload: true,
  adjustFontFallback: false,
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"],
  preload: true,
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: "AI Memory Bank - Your Digital Memory Assistant",
  description: "Store, search, and interact with your memories using AI-powered semantic search",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${montserrat.variable} ${openSans.variable}`} suppressHydrationWarning>
        <body className="font-montserrat antialiased">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <Toaster 
              richColors 
              position="top-right"
              expand={false}
              duration={2500}
              closeButton
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
