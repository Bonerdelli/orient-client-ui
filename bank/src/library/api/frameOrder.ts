import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

import { PaginatedRequest, defaultPaginatedRequest } from 'library/helpers/api'
import { Order, GridResponse } from 'library/models'

export async function getFrameOrdersList(
  _params: unknown,
  request: PaginatedRequest = defaultPaginatedRequest
) {
  return await post<GridResponse<Order[]>>('/operator/order/frame/list', request)
}

export interface FrameOrderItemParams {
  bankId: number
  orderId: number | bigint
}

export async function getFrameOrderWizard(params: FrameOrderItemParams) {
  const { bankId, orderId } = params
  return await get<Order>(`/bank/${bankId}/wizard/frame/${orderId}`)
}

export interface FrameOrderStepParams extends FrameOrderItemParams {
  step: number
}

export async function getFrameOrderWizardStep(params: FrameOrderStepParams) {
  const { bankId, orderId, step } = params
  return await get<Order>(`/bank/${bankId}/wizard/frame/${orderId}/${step}`)
}
