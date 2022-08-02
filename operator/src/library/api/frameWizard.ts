import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

import { CompanyDto, CompanyFounderDto, CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

// export type WizardStep1To2Request = schema.components['schemas']['ClientFrameStep1To2Request']
export type FrameWizardRejectOrderRequest = schema.components['schemas']['RejectOrderDto']
export type FrameWizardDocumentStatusRequest = schema.components['schemas']['OrderDocumentStatusRequest']
export type FrameWizardStopFactorRequest = schema.components['schemas']['OrderStopFactorRequest']

export interface FrameWizardParameters {
  orderId?: number
  step?: number
}

export interface FrameWizardsCommonParameters extends FrameWizardParameters {
  type?: FrameWizardType
}

export interface FrameWizardStepParameters extends FrameWizardParameters {
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
  params: FrameWizardsCommonParameters,
  request: unknown,
) {
  const { orderId, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await post(`/operator/wizard/${wizard}/${orderId}/1`, request)
}

/**
 * Send wizard step 2
 */
export async function sendFrameWizardStep2(
  params: FrameWizardsCommonParameters,
  request: unknown,
) {
  const { orderId, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await post(`/operator/wizard/${wizard}/${orderId}/2`, request)
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
  params: FrameWizardParameters,
) {
  const { orderId } = params
  return await get(`/operator/wizard/frame/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFrameWizardStep(
  params: FrameWizardsCommonParameters,
) {
  const { orderId, step, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await get(`/operator/wizard/${wizard}/${orderId}/${step}`)
}

/**
 * Reject order
 */
export async function frameWizardReject(
  params: FrameWizardsCommonParameters,
  request: FrameWizardRejectOrderRequest,
) {
  const { orderId, step, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await post(`/operator/wizard/${wizard}/${orderId}/${step}`, request)
}

/**
 * Set document status (reject or approve)
 */
export async function frameWizardSetDocStatus(
  params: FrameWizardsCommonParameters,
  request: FrameWizardDocumentStatusRequest,
) {
  const { orderId, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await post(`/operator/wizard/${wizard}/${orderId}/docStatus`, request)
}

/**
 * Set stop factor status (reject or approve)
 */
export async function frameWizardSetStopFactor(
  params: FrameWizardParameters,
  request: FrameWizardStopFactorRequest,
) {
  const { orderId } = params
  return await post(`/operator/wizard/frame/${orderId}/stopFactor`, request)
}
