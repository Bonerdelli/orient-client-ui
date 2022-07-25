import { UserType } from 'orient-ui-library/library/models'
import { User } from 'library/models/user'

export const isBank = (user: User) => user.userType === UserType.Bank
