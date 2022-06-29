import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

import { CompanyDto, CompanyFounderDto, CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'

// export type WizardStep1To2Request = schema.components['schemas']['ClientFrameStep1To2Request']
export type FrameWizardRejectOrderRequest = schema.components['schemas']['RejectOrderDto']
export type FrameWizardDocumentStatusRequest = schema.components['schemas']['OrderDocumentStatusRequest']
export type FrameWizardStopFactorRequest = schema.components['schemas']['OrderStopFactorRequest']

export interface FrameWizardCommonParameters {
  bankId?: number | bigint
  orderId?: number
  step?: number
}

export interface FrameWizardStepParameters extends FrameWizardCommonParameters {
  orderId: number
}

// TODO: ask be to generate typings for this
export interface FrameWizardStep1Response {
  clientCompany: CompanyDto
  customerCompany: CompanyDto
  clientCompanyFounder: CompanyFounderDto
  clientCompanyRequisites: CompanyRequisitesDto
}

/**
 * Send wizard step 1
 */
export async function sendFrameWizardStep1(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { bankId, orderId } = params
  return await post(`/bank/${bankId}/wizard/frame/${orderId}/1`, request, true)
}

/**
 * Send wizard step 2
 */
export async function sendFrameWizardStep2(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { bankId, orderId } = params
  return await post(`/bank/${bankId}/wizard/frame/${orderId}/2`, request, true)
}

/**
 * Send wizard step 3
 */
export async function sendFrameWizardStep3(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { bankId, orderId } = params
  return await post(`/bank/${bankId}/wizard/frame/${orderId}/3`, request, true)
}

/**
 * Send wizard step 4
 */
export async function sendFrameWizardStep4(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { bankId, orderId } = params
  return await post(`/bank/${bankId}/wizard/frame/${orderId}/4`, request, true)
}

/**
 * Get current step
 */
export async function getCurrentFrameWizardStep(
  params: FrameWizardCommonParameters,
) {
  const { bankId, orderId } = params
  return await get(`/bank/${bankId}/wizard/frame/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFrameWizardStep(
  params: FrameWizardCommonParameters,
) {
  const { bankId, orderId, step } = params
  return await get(`/bank/${bankId}/wizard/frame/${orderId}/${step}`)
}
