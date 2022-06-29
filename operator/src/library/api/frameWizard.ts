import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

import { Company, CompanyHead, CompanyRequisites } from 'orient-ui-library/library/models/proxy'

// export type WizardStep1To2Request = schema.components['schemas']['ClientFrameStep1To2Request']
export type FrameWizardRejectOrderRequest = schema.components['schemas']['RejectOrderDto']
export type FrameWizardDocumentStatusRequest = schema.components['schemas']['OrderDocumentStatusRequest']
export type FrameWizardStopFactorRequest = schema.components['schemas']['OrderStopFactorRequest']

export interface FrameWizardCommonParameters {
  orderId?: number
  step?: number
}

export interface FrameWizardStepParameters extends FrameWizardCommonParameters {
  orderId: number
}

// TODO: ask be to generate typings for this
export interface FrameWizardStep1Response {
  clientCompany: Company
  customerCompany: Company
  clientCompanyFounder: CompanyHead
  clientCompanyRequisites: CompanyRequisites
}

/**
 * Send wizard step 1
 */
export async function sendFrameWizardStep1(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { orderId } = params
  return await post(`/operator/wizard/frame/${orderId}/1`, request)
}

/**
 * Send wizard step 2
 */
export async function sendFrameWizardStep2(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { orderId } = params
  return await post(`/operator/wizard/frame/${orderId}/2`, request)
}

/**
 * Send wizard step 3
 */
export async function sendFrameWizardStep3(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { orderId } = params
  return await post(`/operator/wizard/frame/${orderId}/3`, request)
}

/**
 * Send wizard step 4
 */
export async function sendFrameWizardStep4(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { orderId } = params
  return await post(`/operator/wizard/frame/${orderId}/4`, request)
}

/**
 * Get current step
 */
export async function getCurrentFrameWizardStep(
  params: FrameWizardCommonParameters,
) {
  const { orderId } = params
  return await get(`/operator/wizard/frame/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFrameWizardStep(
  params: FrameWizardCommonParameters,
) {
  const { orderId, step } = params
  return await get(`/operator/wizard/frame/${orderId}/${step}`)
}

/**
 * Reject order
 */
export async function frameWizardReject(
  params: FrameWizardCommonParameters,
  request: FrameWizardRejectOrderRequest,
) {
  const { orderId, step } = params
  return await post(`/operator/wizard/frame/${orderId}/${step}`, request)
}

/**
 * Set document status (reject or approve)
 */
export async function frameWizardSetDocStatus(
  params: FrameWizardCommonParameters,
  request: FrameWizardDocumentStatusRequest,
) {
  const { orderId } = params
  return await post(`/operator/wizard/frame/${orderId}/docStatus`, request)
}

/**
 * Set stop factor status (reject or approve)
 */
export async function frameWizardSetStopFactor(
  params: FrameWizardCommonParameters,
  request: FrameWizardStopFactorRequest,
) {
  const { orderId } = params
  return await post(`/operator/wizard/frame/${orderId}/stopFactor`, request)
}
