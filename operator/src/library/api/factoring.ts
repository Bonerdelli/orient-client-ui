import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

import { PaginatedRequest, defaultPaginatedRequest } from 'library/helpers/api'
import { Order } from 'orient-ui-library/library/models/order'
import { GridResponse } from 'library/models'

export async function getFactoringOrdersList(
  _params: unknown,
  request: PaginatedRequest = defaultPaginatedRequest
) {
  return await post<GridResponse<Order[]>>('/operator/order/frame/list', request)
}

export interface FactoringItemParams {
  orderId: number | bigint
}

export async function getFactoringOrderWizard(params: FactoringItemParams) {
  const { orderId } = params
  return await get<Order>(`/operator/wizard/frame/${orderId}`)
}

export interface FactoringStepParams {
  orderId: number | bigint
  step: number
}

export async function getFactoringOrderWizardStep(params: FactoringStepParams) {
  const { orderId, step } = params
  return await get<Order>(`/operator/wizard/frame/${orderId}/${step}`)
}
