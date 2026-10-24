import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HomeMate Rentals | Find Your Ideal Home",
  description: "Modern rental property website for discovering verified homes and apartments in Nairobi and nearby areas.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
