import { Action, action } from 'easy-peasy'

import { Company } from 'library/models/proxy' // TODO: to ui-lib

/**
 * Company application state (example)
 */

export interface CompanyStoreModel {
  current?: Company | undefined
  setCompany: Action<CompanyStoreModel, Company>
}

export const companyStoreModel: CompanyStoreModel = {
  current: undefined,
  setCompany: action((state, payload) => {
    state.current = payload
  }),
}
