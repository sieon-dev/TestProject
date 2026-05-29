import { notFound } from 'next/navigation'
import { getOrderById } from '@/services/orderService'
import OrderForm from '@/components/orders/OrderForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditOrderPage({ params }: PageProps) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">주문 수정</h2>
        <p className="mt-1 text-xs text-gray-400 font-mono">{order.id}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <OrderForm mode="edit" initialData={order} />
      </div>
    </div>
  )
}
