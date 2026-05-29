'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface HeaderProps {
  username: string
}

export default function Header({ username }: HeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-900">주문 관리 시스템</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{username} 님</span>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </header>
  )
}
