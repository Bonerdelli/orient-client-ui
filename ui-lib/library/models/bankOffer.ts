import { BankDto } from 'library/models/proxy'

export interface BankOffer {
  bank: BankDto
  offerStatus: BankOfferStatus
}

export enum BankOfferStatus {
  BankViewed = 'bank_bank_viewed',
  BankWaitForVerify = 'bank_bank_wait_for_verify',
  BankVerify = 'bank_bank_verify',
  BankOffer = 'bank_bank_offer',
  BankSign = 'bank_bank_sign',
  BankOfferSent = 'bank_bank_offer_sent',
  CustomerSign = 'bank_customer_sign',
  Completed = 'bank_completed',
}
