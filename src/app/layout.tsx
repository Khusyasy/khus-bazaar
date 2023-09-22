import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/material-tailwind';

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
    <html lang="en" className="bg-blue-gray-50">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
