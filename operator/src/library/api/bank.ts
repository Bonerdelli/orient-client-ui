import { ApiResponse,  post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'
import { BankDto } from 'orient-ui-library/library/models/proxy'

import { GridResponse } from 'library/models' // TODO: move to ui-lib after debugging
import portalConfig from 'config/portal.yaml'

const QUICK_SEARCH_MAX_ITEMS = portalConfig.dataDisplay.quickSearchMaxItems
const MAX_LIST_ITEMS = 100

export type BankGridRequest = schema.components['schemas']['BankGridRequest']
export type BankGridResponse = ApiResponse<GridResponse<BankDto>>

export async function getAllBanks(_: never) {
  const request: BankGridRequest = {
    limit: MAX_LIST_ITEMS,
    page: 1,
  }
  return await post<GridResponse>('/operator/bank/list', request)
}

export interface SearchBanksParams {
  name?: string
}

export async function searchBanks(params: SearchBanksParams) {
  const request: BankGridRequest = {
    name: params.name,
    limit: QUICK_SEARCH_MAX_ITEMS,
    page: 1,
  }
  return await post<GridResponse>('/operator/bank/list', request)
}
