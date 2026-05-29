'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { ORDER_STATUSES } from '@/lib/constants'
import type { OrderStatus } from '@/types/order'

export default function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }
      params.delete('page') // 필터 변경 시 첫 페이지로
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ search: search || null })
  }

  function handleReset() {
    setSearch('')
    router.push(pathname)
  }

  const currentStatus = searchParams.get('status') || ''

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
      {/* 검색 */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="고객명 또는 상품명으로 검색"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          검색
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          초기화
        </button>
      </form>

      {/* 상태 필터 탭 */}
      <div className="flex flex-wrap gap-2">
        {['', ...ORDER_STATUSES].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => updateParams({ status: s || null })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              currentStatus === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s || '전체'}
          </button>
        ))}
      </div>
    </div>
  )
}
