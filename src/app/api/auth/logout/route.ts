import { NextResponse } from 'next/server'
import { logout } from '@/services/authService'

export async function POST() {
  try {
    await logout()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
