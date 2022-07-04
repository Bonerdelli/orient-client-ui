import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

export type FactoringWizardDocumentStatusRequest = schema.components['schemas']['OrderDocumentStatusRequest']
export type FactoringWizardStopFactorRequest = schema.components['schemas']['OrderStopFactorRequest']

interface FactoringWizardCommonParameters {
  orderId?: number
  step?: number
}

export interface FactoringWizardStepParameters extends FactoringWizardCommonParameters {
  orderId: number
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
  return await post(`/operator/wizard/factor/${orderId}/${step}`, request, true)
}

/**
 * Get current step
 */
export async function getCurrentFactoringWizardStep(
  params: FactoringWizardCommonParameters,
) {
  const { orderId } = params
  return await get(`/operator/wizard/factor/${orderId}`)
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
  return await post(`/operator/wizard/frame/${orderId}/docStatus`, request)
}

/**
 * Set stop factor status (reject or approve)
 */
export async function factoringWizardSetStopFactor(
  params: FactoringWizardCommonParameters,
  request: FactoringWizardStopFactorRequest,
) {
  const { orderId } = params
  return await post(`/operator/wizard/frame/${orderId}/stopFactor`, request)
}
