import { User, UserRoles } from 'library/models'

/**
 * Check is user has access for a given resource
 * NOTE: role-based access not supported in current realization
 */
export const hasAccess = (
  userRoles: UserRoles = [],
  accessRoles: UserRoles = undefined,
) => {
  if (!accessRoles || !accessRoles.length) return true
  return userRoles.some(role => accessRoles.includes(role))
}


/**
 * Checks if user has administrative privilegies with full access
 * NOTE: roles not supported, so here is dirty checking by user login
 */

export const isAdmin = (user: User) => user.login === 'admin'

/**
 * Checks if user has corresponding privilegies
 * NOTE: roles not supported, so here is dirty checking by user login
 */

export const isClient = (user: User) => isAdmin(user) || user.login === 'client'

export const isCustomer = (user: User) => isAdmin(user) || user.login === 'customer'

export const isOperator = (user: User) => isAdmin(user) || user.login === 'operator'

export const isBank = (user: User) => isAdmin(user) || user.login === 'bank'
