import { Action, action } from 'easy-peasy'
import { Dictionaries } from 'orient-ui-library/library/models'

export interface DictionaryStoreModel {
  list?: Dictionaries;
  setDictionaries: Action<DictionaryStoreModel, Dictionaries>;
}

export const dictionaryStoreModel: DictionaryStoreModel = {
  list: undefined,
  setDictionaries: action((state, payload) => {
    state.list = payload
  }),
}
