import { OrderPayer } from 'models/orderCondition'

export enum CurrencyEnum {
  UZS = 'UZS',
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
}

export interface CodeNameDictionary<T = string> {
  code: T;
  name: string;
}

export interface IdValueDictionary<T = number> {
  id: T;
  value: string;
}

export interface CurrencyDictionary extends CodeNameDictionary<CurrencyEnum> {
  number: number;
  orderNumber: number;
}

export interface Dictionaries {
  currency: CurrencyDictionary[]
  passport: CodeNameDictionary[]
  orderCondition: CodeNameDictionary[]
  creditExpiration: IdValueDictionary[]
  employeeCount: IdValueDictionary[]
  paymentForm: IdValueDictionary[]
  taxationSystem: IdValueDictionary[]
  orderType: CodeNameDictionary[]
  orderStatus: CodeNameDictionary[]
  orderPayer: CodeNameDictionary<OrderPayer>[]
}
