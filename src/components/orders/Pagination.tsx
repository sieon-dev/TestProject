'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface Props {
  currentPage: number
  totalPages: number
  total: number
}

export default function Pagination({ currentPage, totalPages, total }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  const effectiveTotalPages = Math.max(1, totalPages)
  const pages = Array.from({ length: effectiveTotalPages }, (_, i) => i + 1)
  // 최대 5개 페이지 버튼 표시
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(effectiveTotalPages, start + 4)
  const visiblePages = pages.slice(start - 1, end)

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-500">전체 {total.toLocaleString()}건</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => goTo(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 text-sm rounded disabled:opacity-30 hover:bg-gray-100"
        >
          «
        </button>
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 text-sm rounded disabled:opacity-30 hover:bg-gray-100"
        >
          ‹
        </button>
        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`px-3 py-1 text-sm rounded ${
              p === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === effectiveTotalPages}
          className="px-2 py-1 text-sm rounded disabled:opacity-30 hover:bg-gray-100"
        >
          ›
        </button>
        <button
          onClick={() => goTo(effectiveTotalPages)}
          disabled={currentPage === effectiveTotalPages}
          className="px-2 py-1 text-sm rounded disabled:opacity-30 hover:bg-gray-100"
        >
          »
        </button>
      </div>
    </div>
  )
}
