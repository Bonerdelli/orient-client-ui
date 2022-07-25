import { Action, action } from 'easy-peasy'

import { CompanyDto } from 'orient-ui-library/library/models/proxy'

/**
 * Company application state (example)
 */

export interface CompanyStoreModel {
  companyId?: number
  current?: CompanyDto | undefined
  setCompanyId: Action<CompanyStoreModel, number | undefined>
  setCompany: Action<CompanyStoreModel, CompanyDto | undefined>
}

export const companyStoreModel: CompanyStoreModel = {
  companyId: undefined,
  current: undefined,
  setCompanyId: action((state, payload) => {
    state.companyId = payload
  }),
  setCompany: action((state, payload) => {
    state.current = payload
  }),
}
