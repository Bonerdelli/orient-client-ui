import { CurrencyEnum } from 'models/dictionaries'

export interface FactoringOrderInfo {
  bankName: string
  amount: number
  currencyCode: CurrencyEnum
  days: number
  contractNumber?: string
  purchaseNumber?: string
}
