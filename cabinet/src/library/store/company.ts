import { Action, action } from 'easy-peasy'

import { CompanyDto } from 'orient-ui-library/library/models/proxy'

/**
 * Company application state (example)
 */

export interface CompanyStoreModel {
  current?: CompanyDto | undefined
  setCompany: Action<CompanyStoreModel, CompanyDto | undefined>
}

export const companyStoreModel: CompanyStoreModel = {
  current: undefined,
  setCompany: action((state, payload) => {
    state.current = payload
  }),
}
