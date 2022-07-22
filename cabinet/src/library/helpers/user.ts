import { UserType } from 'orient-ui-library/library/models'
import { User } from 'library/models/user'

export const isClient = (user: User) => user.userType === UserType.Company && user.isClient
export const isCustomer = (user: User) => user.userType === UserType.Company && user.isCustomer
