import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import UserNav from '@/components/Auth/UserNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkedIn Post Generator',
  description: 'Générez des posts LinkedIn inspirés par vos images',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 max-w-4xl flex justify-between items-center">
            <h1 className="text-xl font-semibold">LinkedIn Post Generator</h1>
            <UserNav />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  )
}
