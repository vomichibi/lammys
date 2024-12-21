import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Providers } from './providers'
import Navigation from './components/Navigation'
import { AuthProvider } from '@/lib/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Lammy's Multi Services",
  description: 'Quality dry cleaning, expert alterations, and quick key cutting services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <Navigation />
            {children}
            <Toaster position="top-center" />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
