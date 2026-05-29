import { NextRequest, NextResponse } from 'next/server'
import { signup } from '@/services/authService'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    const result = await signup(username, password)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
