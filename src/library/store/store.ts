import { createStore, createTypedHooks } from 'easy-peasy'
import { Reducer, compose, applyMiddleware } from 'redux'
import { PersistConfig, persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { axiosMiddleware } from 'orient-ui-library/library/helpers/api'

import { UserStoreModel, userStoreModel } from './user'

export const STORAGE_KEY_PREFIX = 'orient-client-0.0.1'

export interface AppStoreModel {
  user: UserStoreModel
}

const persistBaseConfig = {
  key: STORAGE_KEY_PREFIX,
  storage,
}

const persistRootConfig: PersistConfig<AppStoreModel> = {
  ...persistBaseConfig,
  whitelist: [
    // Put store keys here to persist state in the local storage
    'user',
  ],
}

const appStoreModel = {
  user: userStoreModel,
}

const reducerEnhancer = compose(
  (reducer: Reducer) => persistReducer(persistRootConfig, reducer),
  applyMiddleware(axiosMiddleware),
);

export const store = createStore<AppStoreModel>(appStoreModel, {
  reducerEnhancer,
  middleware: [ axiosMiddleware ]
})

const typedHooks = createTypedHooks<AppStoreModel>()
export const { useStoreActions } = typedHooks
export const { useStoreState } = typedHooks
// export const { useStoreDispatch } = typedHooks

export const persistor = persistStore(store)
export default store
