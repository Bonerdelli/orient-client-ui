import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import { defaultPaginatedRequest, PaginatedRequest } from 'library/helpers/api'
import { GridResponse, Order } from 'library/models'
import { FrameOrderItemParams } from 'library/api/frameOrder'


export interface FactoringItemParams {
  bankId: number
}

export async function getFactoringOrdersList(
  params: FactoringItemParams,
  request: PaginatedRequest = defaultPaginatedRequest,
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

export async function setAssignedUserForFactoringOrder(params: FrameOrderItemParams) {
  const { orderId, bankId } = params
  return await post(`/bank/${bankId}/wizard/factor/${orderId}/assign`, {}, true)
}
