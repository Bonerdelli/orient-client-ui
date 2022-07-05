import { createStore, createTypedHooks, persist } from 'easy-peasy'

import { axiosMiddleware } from 'orient-ui-library/library/helpers/api'
import { UserStoreModel, userStoreModel } from 'orient-ui-library/library/store/user'
import { dictionaryStoreModel, DictionaryStoreModel } from 'library/store/dictionaries'

export const STORAGE_KEY_VERSION = 1

export interface AppStoreModel {
  user: UserStoreModel
  dictionary: DictionaryStoreModel;
}

const appStoreModel = {
  user: userStoreModel,
  dictionary: dictionaryStoreModel,
}

export const store = createStore<AppStoreModel>(
  persist(appStoreModel, {
    storage: localStorage,
    allow: [ 'user' ],
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
