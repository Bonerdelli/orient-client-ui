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
 * Send N-th wizard step
 */
export async function sendFrameSimpleWizardStep(
  params: FrameSimpleWizardCommonParameters,
  request: unknown // NOTE: ask be to generate models
) {
  const { orderId, step } = params
  return await post(`/operator/wizard/frameSimple/${orderId}/${step}`, request)
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
 * Set document status (reject or approve)
 */
export async function frameSimpleWizardSetDocStatus(
  params: FrameSimpleWizardCommonParameters,
  request: FrameSimpleWizardDocumentStatusRequest,
) {
  const { orderId, step } = params
  return await post(`/operator/wizard/frameSimple/${orderId}/${step}`, request)
}
