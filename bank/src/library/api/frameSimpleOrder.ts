import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

import { PaginatedRequest, defaultPaginatedRequest } from 'library/helpers/api'
import { Order, GridResponse } from 'library/models'


export interface FrameSimpleItemParams {
  bankId: number
}

export async function getFrameSimpleOrdersList(
  params: FrameSimpleItemParams,
  request: PaginatedRequest = defaultPaginatedRequest
) {
  const { bankId } = params
  return await post<GridResponse<Order[]>>(`/bank/${bankId}/order/frameSimple/list`, request)
}

export interface FrameSimpleOrderItemParams {
  bankId: number
  orderId: number | bigint
}

export async function getFrameSimpleOrderWizard(params: FrameSimpleOrderItemParams) {
  const { bankId, orderId } = params
  return await get<Order>(`/bank/${bankId}/wizard/frameSimple/${orderId}`)
}

export interface FrameSimpleOrderStepParams extends FrameSimpleOrderItemParams {
  step: number
}

export async function getFrameSimpleOrderWizardStep(params: FrameSimpleOrderStepParams) {
  const { bankId, orderId, step } = params
  return await get<Order>(`/bank/${bankId}/wizard/frameSimple/${orderId}/${step}`)
}
