import { Customer } from 'library/models/customer'

export interface OrderForFactoringDto {
  id: number
  customer: Customer
}
