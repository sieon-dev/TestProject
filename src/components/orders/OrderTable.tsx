'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Order } from '@/types/order'
import { formatDate, formatAmount } from '@/lib/utils'
import StatusSelect from './StatusSelect'

interface Props {
  orders: Order[]
  sortBy: string
  sortOrder: string
}

const columns = [
  { key: 'id', label: '주문ID' },
  { key: 'customer_name', label: '고객명' },
  { key: 'contact', label: '연락처' },
  { key: 'product_name', label: '상품명' },
  { key: 'quantity', label: '수량' },
  { key: 'amount', label: '주문금액', sortable: true },
  { key: 'status', label: '주문상태', sortable: true },
  { key: 'created_at', label: '등록일시', sortable: true },
  { key: 'updated_at', label: '수정일시' },
  { key: 'actions', label: '작업' },
]

// created_at과 updated_at이 같으면 수정한 적 없음
function formatUpdatedAt(createdAt: string, updatedAt: string): string {
  const diff = Math.abs(new Date(updatedAt).getTime() - new Date(createdAt).getTime())
  return diff < 1000 ? '' : formatDate(updatedAt)
}

export default function OrderTable({ orders, sortBy, sortOrder }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleSort(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (sortBy === key) {
      params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      params.set('sortBy', key)
      params.set('sortOrder', 'desc')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleRowClick(id: string) {
    router.push(`/orders/${id}`)
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation() // 행 클릭 이벤트 전파 차단
    if (!confirm('주문을 삭제하시겠습니까?')) return
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('삭제에 실패했습니다.')
    }
  }

  function handleEditClick(e: React.MouseEvent, id: string) {
    e.stopPropagation() // 행 클릭 이벤트 전파 차단
    router.push(`/orders/${id}/edit`)
  }

  function handleStatusClick(e: React.MouseEvent) {
    e.stopPropagation() // 상태 변경 클릭 시 상세 이동 차단
  }

  const sortIcon = (key: string) => {
    if (sortBy !== key) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-blue-600 ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
        등록된 주문이 없습니다.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap ${
                  (col as { sortable?: boolean }).sortable ? 'cursor-pointer hover:text-gray-700 select-none' : ''
                }`}
                onClick={() => (col as { sortable?: boolean }).sortable && handleSort(col.key)}
              >
                {col.label}
                {(col as { sortable?: boolean }).sortable && sortIcon(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => handleRowClick(order.id)}
              className="hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8)}…</td>
              <td className="px-4 py-3 font-medium text-gray-900">{order.customer_name}</td>
              <td className="px-4 py-3 text-gray-600">{order.contact}</td>
              <td className="px-4 py-3 text-gray-700">{order.product_name}</td>
              <td className="px-4 py-3 text-gray-700 text-right">{order.quantity.toLocaleString()}</td>
              <td className="px-4 py-3 text-gray-700 text-right">{formatAmount(order.amount)}</td>
              <td className="px-4 py-3" onClick={handleStatusClick}>
                <StatusSelect orderId={order.id} currentStatus={order.status} />
              </td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(order.created_at)}</td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {formatUpdatedAt(order.created_at, order.updated_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleEditClick(e, order.id)}
                    className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, order.id)}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
