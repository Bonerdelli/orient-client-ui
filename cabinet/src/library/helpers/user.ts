import { User, UserType } from 'library/models/user'

export const isClient = (user: User) => user.userType === UserType.Company && user.isClient
export const isCustomer = (user: User) => user.userType === UserType.Company && user.isCustomer
