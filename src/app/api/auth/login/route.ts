import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/services/authService'

export async function POST(request: NextRequest) {
  try {
    const { id, password } = await request.json()
    const result = await login(id, password)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[login]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
