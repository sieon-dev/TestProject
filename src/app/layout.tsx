import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '주문 관리 시스템',
  description: '관리자용 주문 관리 웹 애플리케이션',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
