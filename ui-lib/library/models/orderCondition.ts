export interface OrderConditions {
  conditionCode: OrderConditionType
  percentYear: number
  percentOverall: number
  percentDiscount: number
  startDate: Date
  payer: OrderPayer
}

export enum OrderConditionType {
  Comission = 'comission',
  Discount = 'discount',
}

export enum OrderPayer {
  Debtor = 'debtor',
  Provider = 'provider'
}
