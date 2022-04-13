import { Action, action } from 'easy-peasy'

import { User } from 'orient-ui-library/models'

/**
 * User application state (example)
 */

export interface UserStoreModel {
  currentUser?: User | undefined
  setCurrentUser: Action<UserStoreModel, User>
}

export const userStoreModel: UserStoreModel = {
  currentUser: undefined,
  setCurrentUser: action((state, payload) => {
    state.currentUser = payload
  }),
}
