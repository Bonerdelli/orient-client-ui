import { User } from 'library/models/user'

export const isClient = (user: User) => user.isClient
export const isCustomer = (user: User) => user.isCustomer
