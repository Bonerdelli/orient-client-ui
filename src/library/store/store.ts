import { persist, createStore, createTypedHooks } from 'easy-peasy'

import { axiosMiddleware } from 'orient-ui-library/library/helpers/api'

import { UserStoreModel, userStoreModel } from './user'

export const STORAGE_KEY_VERSION = 1

export interface AppStoreModel {
  user: UserStoreModel
}

const appStoreModel = {
  user: persist(userStoreModel),
}

export const store = createStore<AppStoreModel>(
  appStoreModel, {
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
