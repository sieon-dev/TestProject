'use client'

import { useEffect, useState } from 'react'

interface Props {
  value: string
  onChange: (address: string) => void
  error?: string | boolean
  id?: string
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: { roadAddress: string; jibunAddress: string }) => void
      }) => { open: () => void }
    }
  }
}

export default function AddressSearch({ value, onChange, error, id }: Props) {
  const [detail, setDetail] = useState('')
  const [baseAddress, setBaseAddress] = useState('')

  // 수정 모드: 초기값 분리
  useEffect(() => {
    if (value && !baseAddress) {
      const match = value.match(/^(.+?)\s*\((.+)\)$/)
      if (match) {
        setBaseAddress(match[1])
        setDetail(match[2])
      } else {
        setBaseAddress(value)
      }
    }
  }, [])

  // 기본주소 + 상세주소 합쳐서 상위로 전달
  // 상세주소가 비어있으면 빈 문자열로 전달해 폼 유효성 검사가 걸리도록 함
  useEffect(() => {
    if (!baseAddress) return
    if (detail.trim()) {
      onChange(`${baseAddress} (${detail.trim()})`)
    } else {
      onChange('')
    }
  }, [baseAddress, detail])

  function openPostcode() {
    if (!window.daum?.Postcode) return
    new window.daum.Postcode({
      oncomplete(data) {
        const selected = data.roadAddress || data.jibunAddress
        setBaseAddress(selected)
        setDetail('')
      },
    }).open()
  }

  // 에러는 폼 제출 시 error prop이 전달될 때만 표시 (blur 시 표시 안 함)
  const showBaseError = !!error && !baseAddress
  const showDetailError = !!error && !!baseAddress && !detail.trim()

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        주소 <span className="text-red-500 ml-0.5">*</span>
      </label>

      {/* 기본 주소 검색 */}
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={baseAddress}
          placeholder="주소 검색 버튼을 눌러주세요"
          className={`flex-1 rounded-lg border px-3 py-2 text-sm bg-gray-50 outline-none ${
            showBaseError ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        <button
          id={id}
          type="button"
          onClick={openPostcode}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          주소 검색
        </button>
      </div>

      {/* 상세 주소 (기본 주소 선택 후 표시) */}
      {baseAddress && (
        <input
          type="text"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="상세 주소 입력 (동/호수 등) *"
          className={`rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
            showDetailError
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
          }`}
        />
      )}

      {/* 에러 메시지: 폼 제출 시에만 표시 */}
      {showBaseError && (
        <p className="text-xs text-red-500">주소를 검색해주세요.</p>
      )}
      {showDetailError && (
        <p className="text-xs text-red-500">상세 주소를 입력해주세요.</p>
      )}
    </div>
  )
}
