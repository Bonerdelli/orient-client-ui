import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

import { PaginatedRequest, defaultPaginatedRequest } from 'library/helpers/api'
import { Order } from 'orient-ui-library/library/models/order'
import { GridResponse } from 'library/models'

export async function getFrameSimpleOrdersList(
  _params: unknown,
  request: PaginatedRequest = defaultPaginatedRequest
) {
  return await post<GridResponse<Order[]>>('/operator/order/frameSimple/list', request)
}

export interface FrameSimpleOrderItemParams {
  orderId: number | bigint
}

export async function getFrameSimpleOrderWizard(params: FrameSimpleOrderItemParams) {
  const { orderId } = params
  return await get<Order>(`/operator/wizard/frameSimple/${orderId}`)
}

export interface FrameSimpleOrderStepParams {
  orderId: number | bigint
  step: number
}

export async function getFrameSimpleOrderWizardStep(params: FrameSimpleOrderStepParams) {
  const { orderId, step } = params
  return await get<Order>(`/operator/wizard/frameSimple/${orderId}/${step}`)
}
