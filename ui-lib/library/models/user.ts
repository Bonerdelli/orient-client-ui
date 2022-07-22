export enum UserType {
  Admin = 'Admin',
  Company = 'Company',
  Customer = 'Customer',
  Operator = 'Operator',
  Bank = 'Bank',
}

export interface User {​
  userId: number
  userType?: UserType
  name: string
  login: string
}

export type UserRoles = string[] | undefined
