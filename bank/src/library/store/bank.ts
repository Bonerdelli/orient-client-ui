import { Action, action } from 'easy-peasy'

import { Bank } from 'library/models/bank' // TODO: to ui-lib

/**
 * Bank application
 */

export interface BankStoreModel {
  current?: Bank | undefined
  setBank: Action<BankStoreModel, Bank>
}

export const bankStoreModel: BankStoreModel = {
  current: undefined,
  setBank: action((state, payload) => {
    state.current = payload
  }),
}
