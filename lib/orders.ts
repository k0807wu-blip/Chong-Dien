import type { OrderStatus } from '@prisma/client';

export const ORDER_STATUS_VALUES = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as const satisfies readonly OrderStatus[];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: '待處理',
  PAID: '已付款',
  SHIPPED: '已出貨',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PAID: 'bg-blue-50 text-blue-600',
  SHIPPED: 'bg-secondary/10 text-secondary',
  COMPLETED: 'bg-green-50 text-green-600',
  CANCELLED: 'bg-red-50 text-red-500',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  ATM_TRANSFER: 'ATM 匯款',
  LINE_PAY: 'LINE Pay',
  COD: '門市取貨付款',
};
