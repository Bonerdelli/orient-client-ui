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
  FRAME_OPERATOR_VERIFYING = 'frame_operator_verify',
  FRAME_CLIENT_REWORK = 'frame_client_rework',
  FRAME_CLIENT_SIGN = 'frame_client_sign',
  FRAME_BANK_VERIFYING = 'frame_bank_verify',
  FRAME_HAS_OFFER = 'frame_has_offer',
  FRAME_CUSTOMER_SIGN = 'frame_customer_sign',
  FRAME_COMPLETED = 'frame_completed',
  FRAME_CANCEL = 'frame_cancel',
  FRAME_OPERATOR_REJECT = 'frame_operator_reject',
}

export enum FactoringStatus {
  FACTOR_DRAFT = 'factor_draft',                                       // Черновик
  FACTOR_OPERATOR_WAIT_FOR_VERIFY = 'factor_operator_wait_for_verify', // Ожидает проверки оператором
  FACTOR_OPERATOR_VERIFY = 'factor_operator_verify',                   // Проверка оператором
  FACTOR_WAIT_FOR_CHARGE = 'factor_wait_for_charge',                   // Ожидает финансирования
  FACTOR_BANK_REJECT = 'factor_bank_reject',                           // Отказ банка
  FACTOR_CLIENT_REWORK = 'factor_client_rework',                       // Доработка
  FACTOR_CLIENT_SIGN = 'factor_client_sign',                           // Требует подписи клиента
  FACTOR_CUSTOMER_SIGN = 'factor_customer_sign',                       // Требует подписи заказчика
  FACTOR_BANK_SIGN = 'factor_bank_sign',                               // Требует подписи банка
  FACTOR_COMPLETED = 'factor_completed',                               // Финансирование погашено
  FACTOR_CANCEL = 'factor_cancel',                                     // Отмена
  FACTOR_CHARGED = 'factor_charged',                                   // Поставщик профинансирован
  FACTOR_OPERATOR_REJECT = 'factor_operator_reject',                   // Отказ системы
}
