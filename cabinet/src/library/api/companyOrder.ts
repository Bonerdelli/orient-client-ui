import { get, post, del } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

import { PaginatedRequest, defaultPaginatedRequest } from 'library/helpers/api'
import { Order } from 'library/models/order'

export type CompanyOrdersSaveRequest = schema.components['schemas']['CompanyFounderSaveRequest']

export interface GetCompanyOrdersBaseParams {
  companyId: number | bigint
}

export async function getCompanyOrdersList(
  params: GetCompanyOrdersBaseParams,
  request: PaginatedRequest = defaultPaginatedRequest
) {
  return await post<Order[]>(`/client/company/${params.companyId}/order/list`, request)
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
