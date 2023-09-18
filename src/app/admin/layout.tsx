import type { Metadata } from 'next'
import { DefaultSidebar } from './sidebar'

export const metadata: Metadata = {
  title: 'Admin - Khus Bazaar',
  description: 'Ecommerce website for your programming needs',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-row h-screen items-center'>
      <DefaultSidebar />
      <div className='h-screen py-8 px-4'>
        {children}
      </div>
    </div>
  )
}
