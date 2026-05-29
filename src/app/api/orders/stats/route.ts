import { NextResponse } from 'next/server'
import { getOrderStats } from '@/services/orderService'

export async function GET() {
  try {
    const stats = await getOrderStats()
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
