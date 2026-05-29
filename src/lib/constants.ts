import type { OrderStatus } from '@/types/order'

export const ORDER_STATUSES: OrderStatus[] = ['접수', '확인중', '입금완료', '배송준비', '완료', '취소']

export const PAGE_SIZE = 10

// 주문 상태별 배지 색상
export const STATUS_COLORS: Record<OrderStatus, string> = {
  '접수': 'bg-blue-100 text-blue-800',
  '확인중': 'bg-amber-100 text-amber-800',
  '입금완료': 'bg-emerald-100 text-emerald-800',
  '배송준비': 'bg-purple-100 text-purple-800',
  '완료': 'bg-gray-100 text-gray-700',
  '취소': 'bg-red-100 text-red-800',
}
