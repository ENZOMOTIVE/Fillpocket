import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="container mx-auto mt-4 px-4">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

