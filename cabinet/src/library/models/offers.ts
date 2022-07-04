import { OrderConditions } from 'orient-ui-library/library'

export interface OfferForFactoringDto {
  bankId: number
  bankName: string
  conditions: OrderConditions
}
