import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/material-tailwind';
import SessionProviderWrapper from '../components/SessionProviderWrapper';

export const metadata: Metadata = {
  title: 'Khus Perpus',
  description: 'Website perpustakaan untuk kebutuhan buku anda',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider>
        <SessionProviderWrapper>
          <body className="bg-blue-gray-50 min-h-screen">{children}</body>
        </SessionProviderWrapper>
      </ThemeProvider>
    </html>
  );
}
