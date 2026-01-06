import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSession } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ペット散歩代行 - 獣医師・動物看護師によるプロフェッショナルケア',
  description: '資格を持つ獣医師・動物看護師による安心のペット散歩代行サービス',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="ja">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header user={session} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
