import { Suspense } from 'react'
import Link from 'next/link'
import { getOrders, getOrderStats } from '@/services/orderService'
import type { OrderStatus } from '@/types/order'
import OrderStats from '@/components/orders/OrderStats'
import SearchBar from '@/components/orders/SearchBar'
import OrderTable from '@/components/orders/OrderTable'
import Pagination from '@/components/orders/Pagination'

interface PageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    sortBy?: string
    sortOrder?: string
    page?: string
  }>
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const sortBy = (params.sortBy as 'created_at' | 'amount' | 'status') || 'created_at'
  const sortOrder = (params.sortOrder as 'asc' | 'desc') || 'desc'

  const [result, stats] = await Promise.all([
    getOrders({
      search: params.search,
      status: params.status as OrderStatus | undefined,
      sortBy,
      sortOrder,
      page,
    }),
    getOrderStats(),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">주문 목록</h2>
        <div className="flex gap-2">
          <a
            href="/api/orders/export"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            CSV 다운로드
          </a>
          <Link
            href="/orders/new"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            주문 등록
          </Link>
        </div>
      </div>

      <OrderStats stats={stats} />

      <Suspense>
        <SearchBar />
      </Suspense>

      <Suspense>
        <OrderTable orders={result.orders} sortBy={sortBy} sortOrder={sortOrder} />
      </Suspense>

      <Suspense>
        <Pagination currentPage={page} totalPages={result.totalPages} total={result.total} />
      </Suspense>
    </div>
  )
}
