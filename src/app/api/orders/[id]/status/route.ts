import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/services/orderService'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()
    const order = await updateOrderStatus(id, status)
    return NextResponse.json(order)
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
