import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}

