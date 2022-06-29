// NOTE: no suck interface in API schema
export interface OrderTerms {
  conditionCode: OrderTermCondition
  percentYear: number
  percentOverall: number
  percentDiscount: number
  startDate: Date
}

export enum OrderTermCondition {
  Comission = 'comission',
  Discount = 'discount',
}
