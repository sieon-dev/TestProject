import OrderForm from '@/components/orders/OrderForm'

export default function NewOrderPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">주문 등록</h2>
        <p className="mt-1 text-sm text-gray-500">새 주문 정보를 입력해주세요.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <OrderForm mode="create" />
      </div>
    </div>
  )
}
