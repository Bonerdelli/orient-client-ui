import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

import { PaginatedRequest, defaultPaginatedRequest } from 'library/helpers/api'
import { Order, GridResponse } from 'library/models'


export interface FactoringItemParams {
  bankId: number
}

export async function getFactoringOrdersList(
  params: FactoringItemParams,
  request: PaginatedRequest = defaultPaginatedRequest
) {
  const { bankId } = params
  return await post<GridResponse<Order[]>>(`/bank/${bankId}/order/factor/list`, request)
}

export interface FactoringOrderItemParams {
  bankId: number
  orderId: number | bigint
}

export async function getFactoringOrderWizard(params: FactoringOrderItemParams) {
  const { bankId, orderId } = params
  return await get<Order>(`/bank/${bankId}/wizard/factor/${orderId}`)
}

export interface FactoringOrderStepParams extends FactoringOrderItemParams {
  step: number
}

export async function getFactoringOrderWizardStep(params: FactoringOrderStepParams) {
  const { bankId, orderId, step } = params
  return await get<Order>(`/bank/${bankId}/wizard/factor/${orderId}/${step}`)
}
