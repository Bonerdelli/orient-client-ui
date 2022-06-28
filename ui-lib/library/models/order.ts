export interface Order {
  id: number
  clientInn: string
  clientName: string
  updatedAt: string
  statusCode: string
  statusName: string
  amount: number | null
  currencyCode: string | null
  currencyName: string | null
  typeCode: OrderWizardType
}

export enum OrderWizardType {
  Frame = 'frame',
  FrameSimple = 'frame_simple',
  Factoring = 'factor',
}

export enum OrderStatus {
  FRAME_DRAFT = 'frame_draft',
  FRAME_OPERATOR_WAIT_FOR_VERIFY = 'frame_operator_wait_for_verify',
  FRAME_OPERATOR_VERIFY = 'frame_operator_verify',
  FRAME_CLIENT_REWORK = 'frame_client_rework',
  FRAME_CLIENT_SIGN = 'frame_client_sign',
  FRAME_BANK_VERIFY = 'frame_bank_verify',
  FRAME_HAS_OFFER = 'frame_has_offer',
  FRAME_CUSTOMER_SIGN = 'frame_customer_sign',
  FRAME_COMPLETED = 'frame_completed',
  FRAME_CANCEL = 'frame_cancel',
  FRAME_OPERATOR_REJECT = 'frame_operator_reject',
}
