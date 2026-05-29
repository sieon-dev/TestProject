export type OrderStatus = '접수' | '확인중' | '입금완료' | '배송준비' | '완료' | '취소'

export interface Order {
  id: string
  customer_name: string
  contact: string
  product_name: string
  quantity: number
  amount: number
  address: string
  status: OrderStatus
  memo: string | null
  created_at: string
  updated_at: string
}

export type CreateOrderInput = Omit<Order, 'id' | 'created_at' | 'updated_at'>
export type UpdateOrderInput = Partial<CreateOrderInput>

export interface OrderFilters {
  search?: string
  status?: OrderStatus | ''
  sortBy?: 'created_at' | 'amount' | 'status'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface OrdersResult {
  orders: Order[]
  total: number
  totalPages: number
}

export interface OrderStats {
  total: number
  접수: number
  입금완료: number
  완료: number
  취소: number
  totalAmount: number
}
