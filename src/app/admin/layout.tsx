import type { Metadata } from 'next'
import DefaultSidebar from './sidebar'

export const metadata: Metadata = {
  title: 'Admin - Khus Perpus',
  description: 'Website perpustakaan untuk kebutuhan buku anda',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-row h-screen items-center p-4'>
      <DefaultSidebar />
      <div className='h-screen w-full p-8'>
        {children}
      </div>
    </div>
  )
}
