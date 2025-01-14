import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import { defaultPaginatedRequest, PaginatedRequest } from 'library/helpers/api'
import { Order } from 'orient-ui-library/library/models/order'
import { GridResponse } from 'library/models'

export async function getFrameOrdersList(
  _params: unknown,
  request: PaginatedRequest = defaultPaginatedRequest,
) {
  return await post<GridResponse<Order[]>>('/operator/order/frame/list', request)
}

export interface FrameOrderItemParams {
  orderId: number | bigint
}

export async function getFrameOrderWizard(params: FrameOrderItemParams) {
  const { orderId } = params
  return await get<Order>(`/operator/wizard/frame/${orderId}`)
}

export interface FrameOrderStepParams {
  orderId: number | bigint
  step: number
}

export async function getFrameOrderWizardStep(params: FrameOrderStepParams) {
  const { orderId, step } = params
  return await get<Order>(`/operator/wizard/frame/${orderId}/${step}`)
}

export async function setAssignedUserForFrameOrder(params: FrameOrderItemParams) {
  const { orderId } = params
  return await post(`/operator/wizard/frame/${orderId}/assign`, {}, true)
}
