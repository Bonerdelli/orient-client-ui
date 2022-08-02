import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'
import { FactoringWizardStepResponse } from 'orient-ui-library/library'

export type FactoringWizardDocumentStatusRequest = schema.components['schemas']['OrderDocumentStatusRequest']
export type FactoringWizardStopFactorRequest = schema.components['schemas']['OrderStopFactorRequest']

interface FactoringWizardCommonParameters {
  orderId?: number
  step?: number
}

export interface FactoringWizardStepParameters extends FactoringWizardCommonParameters {
  orderId: number
}

export interface RejectFactoringOrderRequest {
  rejectReasonId: number
  rejectComment: string
}

/**
 * Send wizard N-th step
 * NOTE: don't care, as BE response have no typings
 */
export async function sendFactoringWizardStep(
  params: FactoringWizardStepParameters,
  request: unknown,
) {
  const { orderId, step } = params
  return await post(`/operator/wizard/factor/${orderId}/${step}`, request)
}

/**
 * Get current wizard info
 */
export async function getFactoringOrderWizard(
  params: FactoringWizardCommonParameters,
) {
  const { orderId } = params
  return await get<FactoringWizardStepResponse<unknown>>(`/operator/wizard/factor/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFactoringWizardStep(
  params: FactoringWizardCommonParameters,
) {
  const { orderId, step } = params
  return await get(`/operator/wizard/factor/${orderId}/${step}`)
}


/**
 * Set document status (reject or approve)
 */
export async function factoringWizardSetDocStatus(
  params: FactoringWizardCommonParameters,
  request: FactoringWizardDocumentStatusRequest,
) {
  const { orderId } = params
  return await post(`/operator/wizard/factor/${orderId}/docStatus`, request)
}

/**
 * Set stop factor status (reject or approve)
 */
export async function factoringWizardSetStopFactor(
  params: FactoringWizardCommonParameters,
  request: FactoringWizardStopFactorRequest,
) {
  const { orderId } = params
  return await post(`/operator/wizard/factor/${orderId}/stopFactor`, request)
}

/**
 * Reject factoring order
 */
export async function rejectFactoringOrder(
  params: FactoringWizardStepParameters,
  request: RejectFactoringOrderRequest,
) {
  const { orderId } = params
  return await post(`/operator/wizard/factor/${orderId}/reject`, request)
}

/**
 * Assign factoring order to current operator
 */
export async function setAssignedUserForFactoringOrder(params: FactoringWizardStepParameters) {
  const { orderId } = params
  return await post(`/operator/wizard/factor/${orderId}/assign`, {}, true)
}
