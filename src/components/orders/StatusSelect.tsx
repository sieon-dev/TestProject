'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ORDER_STATUSES, STATUS_COLORS } from '@/lib/constants'
import type { OrderStatus } from '@/types/order'

interface Props {
  orderId: string
  currentStatus: OrderStatus
}

export default function StatusSelect({ orderId, currentStatus }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as OrderStatus
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      setStatus(newStatus)
      router.refresh()
    } catch {
      alert('상태 변경에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium border-0 outline-none cursor-pointer disabled:opacity-50 ${STATUS_COLORS[status]}`}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}
