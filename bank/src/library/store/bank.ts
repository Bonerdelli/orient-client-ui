import { Action, action } from 'easy-peasy'

export interface BankStoreModel {
  bankId?: number | bigint
  setBankId: Action<BankStoreModel, number | bigint>
}

export const bankStoreModel: BankStoreModel = {
  bankId: undefined,
  setBankId: action((state, payload) => {
    state.bankId = payload
  }),
}
