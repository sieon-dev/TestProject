import { NextRequest, NextResponse } from 'next/server'
import { getOrders, createOrder } from '@/services/orderService'
import type { OrderStatus } from '@/types/order'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const result = await getOrders({
      search: searchParams.get('search') || undefined,
      status: (searchParams.get('status') as OrderStatus) || undefined,
      sortBy: (searchParams.get('sortBy') as 'created_at' | 'amount' | 'status') || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '10'),
    })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const order = await createOrder({
      customer_name: body.customer_name,
      contact: body.contact,
      product_name: body.product_name,
      quantity: Number(body.quantity),
      amount: Number(body.amount),
      address: body.address,
      status: body.status,
      memo: body.memo || null,
    })
    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
