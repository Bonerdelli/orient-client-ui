import { OrderStatus } from 'orient-ui-library/library/models/order'

export const FRAME_REJECTION_ALLOWED_STATUSES = [
  OrderStatus.FRAME_BANK_VERIFYING,
  OrderStatus.FRAME_BANK_SIGN,
  OrderStatus.FRAME_HAS_OFFER,
  OrderStatus.FRAME_CUSTOMER_SIGN,
  OrderStatus.FRAME_COMPLETED,
  OrderStatus.FRAME_OPERATOR_REJECT,
  OrderStatus.FRAME_BANK_REJECT,
  OrderStatus.FRAME_CANCEL,
]
