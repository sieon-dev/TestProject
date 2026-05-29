import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrderById } from '@/services/orderService'
import { formatDate, formatAmount } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import StatusSelect from '@/components/orders/StatusSelect'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  const fields = [
    { label: '주문 ID', value: order.id },
    { label: '고객명', value: order.customer_name },
    { label: '연락처', value: order.contact },
    { label: '상품명', value: order.product_name },
    { label: '수량', value: `${order.quantity.toLocaleString()}개` },
    { label: '주문금액', value: formatAmount(order.amount) },
    { label: '주소', value: order.address },
    { label: '메모', value: order.memo || '-' },
    { label: '등록일시', value: formatDate(order.created_at) },
    {
      label: '수정일시',
      value: Math.abs(new Date(order.updated_at).getTime() - new Date(order.created_at).getTime()) < 1000
        ? '-'
        : formatDate(order.updated_at),
    },
  ]

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">주문 상세</h2>
          <p className="mt-1 text-xs text-gray-400 font-mono">{order.id}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/orders"
            className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            목록으로
          </Link>
          <Link
            href={`/orders/${order.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            수정
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {/* 주문 상태 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">주문상태</span>
          <StatusSelect orderId={order.id} currentStatus={order.status} />
        </div>

        {/* 상세 정보 */}
        <dl className="divide-y divide-gray-100">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex px-6 py-4 gap-4">
              <dt className="w-28 shrink-0 text-sm text-gray-500">{label}</dt>
              <dd className="text-sm text-gray-900 break-all">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
