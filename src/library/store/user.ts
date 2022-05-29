import { Action, action } from 'easy-peasy'
import { User, JwtToken } from 'orient-ui-library'

/**
 * User application state (example)
 */

export interface UserStoreModel {
  current?: User | undefined
  currentAuth?: JwtToken | undefined
  setUser: Action<UserStoreModel, User>
  setAuth: Action<UserStoreModel, JwtToken>
  setLogout: Action<UserStoreModel>
}

export const userStoreModel: UserStoreModel = {
  current: undefined,
  setUser: action((state, payload) => {
    state.current = payload
  }),
  setAuth: action((state, payload) => {
    state.currentAuth = payload
  }),
  setLogout: action((state) => {
    delete state.current
    delete state.currentAuth
  }),
}
