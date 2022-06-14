export type OrderStatusCode = 'frame_draft' // TODO: ask be
export type OrderTypeCode = 'frame'

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
  typeCode: OrderTypeCode
}
