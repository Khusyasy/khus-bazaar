import type { Metadata } from 'next';
import DefaultSidebar from '../../components/Sidebar';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/material-tailwind';

export const metadata: Metadata = {
  title: 'Admin - Khus Perpus',
  description: 'Website perpustakaan untuk kebutuhan buku anda',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/admin/dashboard');
  }

  if (session.role !== 'ADMIN') {
    return (
      <div className="flex flex-row h-screen items-center justify-center p-4">
        <div className="h-screen w-full p-8 flex flex-col items-center">
          <h1 className="text-2xl font-semibold text-center mb-4">
            You are not authorized to access this page
          </h1>
          <Link
            legacyBehavior
            href="/"
            className="text-2xl font-semibold text-center"
          >
            <Button color="blue-gray">Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen items-center p-4">
      <DefaultSidebar />
      <div className="h-screen w-full p-8">{children}</div>
    </div>
  );
}
