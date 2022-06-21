export type UserRoles = string[] | undefined

export interface User {​
  userId: number
  name: string
  companyRoles: UserRoles
}
