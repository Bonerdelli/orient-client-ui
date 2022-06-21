import { persist, createStore, createTypedHooks } from 'easy-peasy'

import { axiosMiddleware } from 'orient-ui-library/library/helpers/api'

import { UserStoreModel, userStoreModel } from 'orient-ui-library/library/store/user'
import { BankStoreModel, bankStoreModel } from './bank'

export const STORAGE_KEY_VERSION = 1

export interface AppStoreModel {
  user: UserStoreModel
  bank: BankStoreModel
}

const appStoreModel = {
  user: userStoreModel,
  bank: bankStoreModel,
}

export const store = createStore<AppStoreModel>(
  persist(appStoreModel, {
    storage: localStorage,
    allow: ['user'],
  }), {
    version: STORAGE_KEY_VERSION,
    middleware: [
      axiosMiddleware,
    ],
  },
)

const typedHooks = createTypedHooks<AppStoreModel>()
export const { useStoreActions } = typedHooks
export const { useStoreState } = typedHooks
// export const { useStoreDispatch } = typedHooks

export default store
