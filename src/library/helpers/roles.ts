import { Roles } from 'library/models'

/**
 * Check is user has access for a given resource
 */
export const hasAccess = (
  userRoles: Roles = [],
  accessRoles: Roles = undefined,
) => {
  if (!accessRoles || !accessRoles.length) return true
  return userRoles.some((role) => accessRoles.includes(role))
}
