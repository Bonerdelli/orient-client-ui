import { ApiResponse,  post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

import { Customer, GridResponse } from 'library/models' // TODO: move to ui-lib after debugging
import portalConfig from 'config/portal.yaml'

const QUICK_SEARCH_MAX_ITEMS = portalConfig.dataDisplay.quickSearchMaxItems

export type CustomerGridRequest = schema.components['schemas']['CustomerGridRequest']
export type CustomerGridResponse = ApiResponse<GridResponse<Customer>>

export async function getCustomers(_, request: CustomerGridRequest) {
  return await post<GridResponse>('/client/customer/list', request)
}

export interface SearchCustomersParams {
  inn?: string
}

export async function searchCustomers(params: SearchCustomersParams) {
  const request: CustomerGridRequest = {
    inn: params.inn,
    limit: QUICK_SEARCH_MAX_ITEMS,
    page: 1,
  }
  return await post<GridResponse>('/client/customer/list', request)
}
