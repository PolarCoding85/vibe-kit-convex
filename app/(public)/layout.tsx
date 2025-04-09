// app/(public)/layout.tsx

import { Header } from '@/components/layout/public/header'
import { Footer } from '@/components/layout/public/footer'

export default function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        {children}
      </main>
      <Footer />
    </div>
  )
}
