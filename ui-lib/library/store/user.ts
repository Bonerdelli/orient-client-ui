import { Action, action } from 'easy-peasy'
import { User, JwtToken, JwtTokenPayload } from 'library/models'
import jwtDecode from 'jwt-decode'

export interface UserStoreModel {
  current?: User | undefined
  currentAuth?: JwtToken | undefined
  setAuth: Action<UserStoreModel, JwtToken>
  setLogout: Action<UserStoreModel>
}

export const userStoreModel: UserStoreModel = {
  current: undefined,
  setAuth: action((state, payload) => {
    const jwtPayload = jwtDecode(payload?.accessToken) as JwtTokenPayload
    const userInfo = JSON.parse(jwtPayload.sub) as User
    console.log('userInfo', userInfo)
    state.currentAuth = payload
    state.current = userInfo
  }),
  setLogout: action(state => {
    delete state.current
    delete state.currentAuth
  }),
}
