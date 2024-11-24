import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/AuthProvider";
import { inter } from './fonts';
import Navigation from './components/Navigation';
import "./globals.css";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Lammy's Dry Cleaning",
  description: "Professional Dry Cleaning Services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          <Navigation />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
