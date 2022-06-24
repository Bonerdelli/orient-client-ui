import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

export type FrameSimpleWizardRejectOrderRequest = schema.components['schemas']['RejectOrderDto']
export type FrameSimpleWizardDocumentStatusRequest = schema.components['schemas']['OrderDocumentStatusRequest']

export interface FrameSimpleWizardCommonParameters {
  orderId?: number
  step?: number
}

export interface FrameSimpleWizardStepParameters extends FrameSimpleWizardCommonParameters {
  orderId: number
}

/**
 * Send wizard step 1
 */
export async function sendFrameSimpleWizardStep1(
  params: FrameSimpleWizardStepParameters,
  request: unknown // NOTE: ask be to generate models
) {
  const { orderId } = params
  return await post(`/operator/wizard/frameSimple/${orderId}/1`, request)
}

/**
 * Send wizard step 2
 */
export async function sendFrameSimpleWizardStep2(
  params: FrameSimpleWizardStepParameters,
  request: unknown // NOTE: ask be to generate models
) {
  const { orderId } = params
  return await post(`/operator/wizard/frameSimple/${orderId}/2`, request)
}

/**
 * Get current step
 */
export async function getCurrentFrameSimpleWizardStep(
  params: FrameSimpleWizardCommonParameters,
) {
  const { orderId } = params
  return await get(`/operator/wizard/frameSimple/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFrameSimpleWizardStep(
  params: FrameSimpleWizardCommonParameters,
) {
  const { orderId, step } = params
  return await get(`/operator/wizard/frameSimple/${orderId}/${step}`)
}

/**
 * Reject order
 */
export async function frameSimpleWizardReject(
  params: FrameSimpleWizardCommonParameters,
  request: FrameSimpleWizardRejectOrderRequest,
) {
  const { orderId, step } = params
  return await post(`/operator/wizard/frameSimple/${orderId}/${step}`, request)
}

/**
 * Set document status (reject or approeve)
 */
export async function frameSimpleWizardSetDocStatus(
  params: FrameSimpleWizardCommonParameters,
  request: FrameSimpleWizardDocumentStatusRequest,
) {
  const { orderId, step } = params
  return await post(`/operator/wizard/frameSimple/${orderId}/${step}`, request)
}
