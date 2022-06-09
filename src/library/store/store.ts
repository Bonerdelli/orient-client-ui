import { persist, createStore, createTypedHooks } from 'easy-peasy'

import { axiosMiddleware } from 'orient-ui-library/library/helpers/api'

import { UserStoreModel, userStoreModel } from './user'
import { CompanyStoreModel, companyStoreModel } from './company'

export const STORAGE_KEY_VERSION = 1

export interface AppStoreModel {
  user: UserStoreModel
  company: CompanyStoreModel
}

const appStoreModel = {
  user: persist(userStoreModel),
  company: companyStoreModel,
}

export const store = createStore<AppStoreModel>(
  persist(appStoreModel, {
    allow: [
      // Put store keys here to persist state in the local storage
      'user',
    ],
  }),
  {
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
