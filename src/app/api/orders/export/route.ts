import { NextResponse } from 'next/server'
import { getAllOrdersForExport } from '@/services/orderService'
import type { Order } from '@/types/order'
import { formatDate } from '@/lib/utils'

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  try {
    const orders = await getAllOrdersForExport()

    const headers = ['주문ID', '고객명', '연락처', '상품명', '수량', '주문금액', '주소', '주문상태', '메모', '등록일시', '수정일시']
    const rows = orders.map((o: Order) =>
      [o.id, o.customer_name, o.contact, o.product_name, o.quantity, o.amount, o.address, o.status, o.memo, formatDate(o.created_at), formatDate(o.updated_at)]
        .map(escapeCsv)
        .join(',')
    )

    // BOM 추가로 한글 인코딩 보장
    const csv = '﻿' + [headers.join(','), ...rows].join('\n')
    const fileName = `orders_${new Date().toISOString().slice(0, 10)}.csv`

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
