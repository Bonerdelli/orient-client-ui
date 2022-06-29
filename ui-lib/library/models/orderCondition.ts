// NOTE: no such interface in API schema
export interface OrderConditions {
  conditionCode: OrderConditionType
  percentYear: number
  percentOverall: number
  percentDiscount: number
  startDate: Date
}

export enum OrderConditionType {
  Comission = 'comission',
  Discount = 'discount',
}
