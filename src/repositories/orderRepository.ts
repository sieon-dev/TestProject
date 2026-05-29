import { getSupabase } from '@/lib/supabase'
import type { Order, CreateOrderInput, UpdateOrderInput, OrderFilters, OrdersResult, OrderStats } from '@/types/order'
import { PAGE_SIZE } from '@/lib/constants'

export async function findOrders(filters: OrderFilters = {}): Promise<OrdersResult> {
  const {
    search,
    status,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    pageSize = PAGE_SIZE,
  } = filters

  let query = getSupabase().from('orders').select('*', { count: 'exact' })

  if (search) {
    query = query.or(`customer_name.ilike.%${search}%,product_name.ilike.%${search}%`)
  }

  if (status) {
    query = query.eq('status', status)
  }

  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const from = (page - 1) * pageSize
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  return {
    orders: (data as Order[]) || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

export async function findOrderById(id: string): Promise<Order | null> {
  const { data, error } = await getSupabase().from('orders').select('*').eq('id', id).single()
  if (error) return null
  return data as Order
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { data, error } = await getSupabase().from('orders').insert(input).select().single()
  if (error) throw new Error(error.message)
  return data as Order
}

export async function updateOrder(id: string, input: UpdateOrderInput): Promise<Order> {
  const { data, error } = await getSupabase().from('orders').update(input).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data as Order
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await getSupabase().from('orders').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getOrderStats(): Promise<OrderStats> {
  const { data, error } = await getSupabase().from('orders').select('status, amount')
  if (error) throw new Error(error.message)

  const orders = data || []
  return {
    total: orders.length,
    '접수': orders.filter((o) => o.status === '접수').length,
    '입금완료': orders.filter((o) => o.status === '입금완료').length,
    '완료': orders.filter((o) => o.status === '완료').length,
    '취소': orders.filter((o) => o.status === '취소').length,
    totalAmount: orders.filter((o) => o.status !== '취소').reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
  }
}

export async function findAllOrders(): Promise<Order[]> {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data as Order[]) || []
}
