'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import AddressSearch from '@/components/orders/AddressSearch'
import { ORDER_STATUSES } from '@/lib/constants'
import type { Order, OrderStatus } from '@/types/order'

interface Props {
  initialData?: Order
  mode: 'create' | 'edit'
}

interface FormData {
  customer_name: string
  contact: string
  product_name: string
  quantity: string
  amount: string
  address: string
  status: OrderStatus
  memo: string
}

interface FormErrors {
  customer_name?: string
  contact?: string
  product_name?: string
  quantity?: string
  amount?: string
  address?: string
}

// 필드 id 순서 (첫 번째 에러 필드로 포커스하기 위한 순서)
const FIELD_ORDER: (keyof FormErrors)[] = [
  'customer_name', 'contact', 'product_name', 'quantity', 'amount', 'address',
]

const statusOptions = ORDER_STATUSES.map((s) => ({ value: s, label: s }))

export default function OrderForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const [form, setForm] = useState<FormData>({
    customer_name: initialData?.customer_name || '',
    contact: initialData?.contact || '',
    product_name: initialData?.product_name || '',
    quantity: initialData?.quantity?.toString() || '1',
    amount: initialData?.amount?.toString() || '0',
    address: initialData?.address || '',
    status: initialData?.status || '접수',
    memo: initialData?.memo || '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!form.customer_name.trim()) errs.customer_name = '고객명을 입력해주세요.'
    if (!form.contact.trim()) errs.contact = '연락처를 입력해주세요.'
    if (!form.product_name.trim()) errs.product_name = '상품명을 입력해주세요.'
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1)
      errs.quantity = '수량은 1 이상의 정수여야 합니다.'
    if (isNaN(Number(form.amount)) || Number(form.amount) < 0)
      errs.amount = '주문금액은 0 이상이어야 합니다.'
    if (!form.address.trim()) errs.address = '주소를 입력해주세요.'
    setErrors(errs)

    // 첫 번째 에러 필드로 포커스 + 스크롤
    const firstErrorField = FIELD_ORDER.find((f) => errs[f])
    if (firstErrorField) {
      setTimeout(() => {
        const el = document.getElementById(firstErrorField)
        if (el) {
          el.focus()
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 0)
    }

    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    const body = {
      ...form,
      quantity: Number(form.quantity),
      amount: Number(form.amount),
      memo: form.memo || null,
    }

    const url = mode === 'create' ? '/api/orders' : `/api/orders/${initialData!.id}`
    const method = mode === 'create' ? 'POST' : 'PUT'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || '저장에 실패했습니다.')
        return
      }

      router.push(`/orders/${data.id}`)
      router.refresh()
    } catch {
      setServerError('서버 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          id="customer_name"
          label="고객명"
          required
          value={form.customer_name}
          onChange={(e) => update('customer_name', e.target.value)}
          error={errors.customer_name}
          placeholder="주문 고객 이름"
        />
        <Input
          id="contact"
          label="연락처"
          required
          value={form.contact}
          onChange={(e) => update('contact', e.target.value)}
          error={errors.contact}
          placeholder="010-0000-0000"
        />
        <Input
          id="product_name"
          label="상품명"
          required
          value={form.product_name}
          onChange={(e) => update('product_name', e.target.value)}
          error={errors.product_name}
          placeholder="상품명"
        />
        <Select
          id="status"
          label="주문상태"
          required
          value={form.status}
          onChange={(e) => update('status', e.target.value)}
          options={statusOptions}
        />
        <Input
          id="quantity"
          label="수량"
          required
          type="number"
          min={1}
          value={form.quantity}
          onChange={(e) => update('quantity', e.target.value)}
          error={errors.quantity}
        />
        <Input
          id="amount"
          label="주문금액 (원)"
          required
          type="number"
          min={0}
          value={form.amount}
          onChange={(e) => update('amount', e.target.value)}
          error={errors.amount}
        />
      </div>

      <AddressSearch
        id="address"
        value={form.address}
        onChange={(addr) => update('address', addr)}
        error={errors.address}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="memo" className="text-sm font-medium text-gray-700">
          메모 <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <textarea
          id="memo"
          rows={3}
          value={form.memo}
          onChange={(e) => update('memo', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
          placeholder="추가 메모 사항"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        {/* 버튼 왼쪽 에러 요약 */}
        {hasErrors ? (
          <p className="text-sm text-red-500">입력하지 않은 필수 항목이 있습니다.</p>
        ) : serverError ? (
          <p className="text-sm text-red-500">{serverError}</p>
        ) : (
          <span />
        )}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" loading={loading}>
            {mode === 'create' ? '주문 등록' : '수정 저장'}
          </Button>
        </div>
      </div>
    </form>
  )
}
