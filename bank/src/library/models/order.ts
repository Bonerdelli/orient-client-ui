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

export interface OrderCheckList {
  id: number
  checkListCode: boolean
  isChecked: boolean
}

export enum OrderWizardType {
  Frame = 'frame',
  FrameSimple = 'frame_simple',
  Factoring = 'factor',
}
