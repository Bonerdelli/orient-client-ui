import { get, post, del } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging
import { Order } from 'orient-ui-library/library/models/order'

import { PaginatedRequest, defaultPaginatedRequest } from 'library/helpers/api'
import { CabinetMode } from 'library/models/cabinet'
import { GridResponse } from 'library/models' // TODO: to ui-lib

export type CompanyOrdersSaveRequest = schema.components['schemas']['CompanyFounderSaveRequest']

export interface GetCompanyOrdersBaseParams {
  companyId: number | bigint
  mode?: CabinetMode,
}

// NOTE: some API wrappers for Client and Customer are combined
const getBasePath = (companyId: number | bigint, mode: CabinetMode = CabinetMode.Client) => {
  const modePath = mode === CabinetMode.Customer ? 'customer' : 'client'
  return `/${modePath}/company/${companyId}`
}

export async function getCompanyOrdersList(
  params: GetCompanyOrdersBaseParams,
  request: PaginatedRequest = defaultPaginatedRequest
) {
  const { mode, companyId } = params
  const basePath = getBasePath(companyId, mode)
  return await post<GridResponse<Order[]>>(`${basePath}/order/list`, request)
}

export interface CompanyOrdersItemParams {
  companyId: number | bigint
  id: number
}

export async function getCompanyOrder(params: CompanyOrdersItemParams) {
  return await get<Order>(`/client/company/${params.companyId}/order/${params.id}`)
}

export async function updateCompanyOrder(
  params: GetCompanyOrdersBaseParams,
  request: CompanyOrdersSaveRequest,
) {
  return await post<Order>(`/client/company/${params.companyId}/order`, request, true)
}

export async function addCompanyOrder(
  params: GetCompanyOrdersBaseParams,
  request: CompanyOrdersSaveRequest,
) {
  return await post<Order>(`/client/company/${params.companyId}/order`, request, true)
}

export async function deleteCompanyOrder(params: CompanyOrdersItemParams) {
  return await del(`/client/company/${params.companyId}/order/${params.id}`)
}
