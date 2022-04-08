export type Roles = string[] | undefined

/**
 * NOTE: Sample user model
 */
export interface User {
  login: string
  fullName: string
  groupId?: number
  roles?: Roles
}
