import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrder, deleteOrder } from '@/services/orderService'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const order = await getOrderById(id)
    if (!order) return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const order = await updateOrder(id, {
      customer_name: body.customer_name,
      contact: body.contact,
      product_name: body.product_name,
      quantity: Number(body.quantity),
      amount: Number(body.amount),
      address: body.address,
      status: body.status,
      memo: body.memo || null,
    })
    return NextResponse.json(order)
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await deleteOrder(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
