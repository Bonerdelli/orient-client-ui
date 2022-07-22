import { User as CommonUser, UserType } from 'orient-ui-library/library/models'

export type UserRoles = string[] | undefined

export interface User extends CommonUser {​
  userType: UserType.Operator
}
