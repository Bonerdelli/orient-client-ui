import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import { defaultPaginatedRequest, PaginatedRequest } from 'library/helpers/api'
import { GridResponse, Order } from 'library/models'


export interface FrameItemParams {
  bankId: number
}

export async function getFrameOrdersList(
  params: FrameItemParams,
  request: PaginatedRequest = defaultPaginatedRequest,
) {
  const { bankId } = params
  return await post<GridResponse<Order[]>>(`/bank/${bankId}/order/frame/list`, request)
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

export async function setAssignedUserForFrameOrder(params: FrameOrderItemParams) {
  const { orderId, bankId } = params
  return await post(`/bank/${bankId}/wizard/frame/${orderId}/assign`, {}, true)
}
