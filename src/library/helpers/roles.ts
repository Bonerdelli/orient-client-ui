import { Roles } from 'library/models'

export const hasAccess = (
  accountRoles: Roles = [],
  accessRoles: Roles = undefined,
) => {
  if (!accessRoles || !accessRoles.length) return true

  return accountRoles.some((role) => accessRoles.includes(role))
}
