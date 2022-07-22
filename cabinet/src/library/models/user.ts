import { User as CommonUser } from 'orient-ui-library/library/models'

export type UserRoles = string[] | undefined

export interface User extends CommonUser {​
  userType: 'Company'
  companyId: number
  isClient: boolean
  isCustomer: boolean
}
