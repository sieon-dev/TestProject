import * as orderRepo from '@/repositories/orderRepository'
import type { CreateOrderInput, UpdateOrderInput, OrderFilters, OrderStatus } from '@/types/order'
import { ORDER_STATUSES } from '@/lib/constants'

function validateCreate(input: CreateOrderInput): string | null {
  if (!input.customer_name?.trim()) return '고객명을 입력해주세요.'
  if (!input.contact?.trim()) return '연락처를 입력해주세요.'
  if (!input.product_name?.trim()) return '상품명을 입력해주세요.'
  if (!Number.isInteger(input.quantity) || input.quantity < 1) return '수량은 1 이상의 정수여야 합니다.'
  if (isNaN(input.amount) || input.amount < 0) return '주문금액은 0 이상이어야 합니다.'
  if (!input.address?.trim()) return '주소를 입력해주세요.'
  if (!ORDER_STATUSES.includes(input.status)) return '올바른 주문 상태를 선택해주세요.'
  return null
}

export async function getOrders(filters: OrderFilters) {
  return orderRepo.findOrders(filters)
}

export async function getOrderById(id: string) {
  return orderRepo.findOrderById(id)
}

export async function createOrder(input: CreateOrderInput) {
  const err = validateCreate(input)
  if (err) throw new Error(err)
  return orderRepo.createOrder(input)
}

export async function updateOrder(id: string, input: UpdateOrderInput) {
  // 전체 필드를 받아서 검증 후 업데이트
  const err = validateCreate(input as CreateOrderInput)
  if (err) throw new Error(err)
  return orderRepo.updateOrder(id, input)
}

export async function updateOrderStatus(id: string, status: string) {
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new Error('올바른 주문 상태를 선택해주세요.')
  }
  return orderRepo.updateOrder(id, { status: status as OrderStatus })
}

export async function deleteOrder(id: string) {
  return orderRepo.deleteOrder(id)
}

export async function getOrderStats() {
  return orderRepo.getOrderStats()
}

export async function getAllOrdersForExport() {
  return orderRepo.findAllOrders()
}
