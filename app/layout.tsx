import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/NavBar'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'SJB Lanches',
  description: 'Registro de saídas — Lanchonete São João Batista',
  manifest: '/manifest.json',
  themeColor: '#C4420A',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SJB Lanches',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-nunito bg-white text-[#1A1A1A] antialiased">
        <main className="min-h-screen">
          {children}
        </main>
        <NavBar />
      </body>
    </html>
  )
}
