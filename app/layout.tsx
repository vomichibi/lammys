import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
<<<<<<< HEAD
import { Toaster } from 'sonner'
import { Providers } from './providers'
import Navigation from './components/Navigation'
=======
import Navigation from './components/Navigation'
import { AuthProvider } from '@/lib/auth-context'
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Lammy's Multi Services",
  description: 'Quality dry cleaning, expert alterations, and quick key cutting services',
=======
  title: 'Lammys',
  description: 'Your trusted source for quality lamb products',
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
<<<<<<< HEAD
        <Providers>
          <Navigation />
          {children}
          <Toaster />
        </Providers>
=======
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7
      </body>
    </html>
  )
}
