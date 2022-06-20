export type UserRoles = string[] | undefined

export interface User {
  login: string
  fullName: string
  groupId?: number
  roles?: UserRoles
}
