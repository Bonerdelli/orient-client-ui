import { UserType } from 'orient-ui-library/library/models'
import { User } from 'library/models/user'

export const isOperator = (user: User) => user.userType === UserType.Operator
