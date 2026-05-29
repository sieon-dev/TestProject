import type { OrderStats } from '@/types/order'
import { formatAmount } from '@/lib/utils'

interface Props {
  stats: OrderStats
}

const cards = [
  { key: 'total', label: '전체 주문' },
  { key: '접수', label: '접수' },
  { key: '입금완료', label: '입금완료' },
  { key: '완료', label: '완료' },
  { key: '취소', label: '취소' },
] as const

export default function OrderStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6 lg:grid-cols-6">
      {cards.map(({ key, label }) => (
        <div key={key} className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{stats[key].toLocaleString()}</p>
        </div>
      ))}
      <div className="rounded-xl border border-gray-200 bg-white p-4 col-span-3 lg:col-span-1">
        <p className="text-xs text-gray-500 mb-1">총 주문금액</p>
        <p className="text-lg font-bold text-blue-600 truncate">{formatAmount(stats.totalAmount)}</p>
      </div>
    </div>
  )
}
