import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

import { CompanyDto, CompanyFounderDto, CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

// export type WizardStep1To2Request = schema.components['schemas']['ClientFrameStep1To2Request']
export type FrameWizardRejectOrderRequest = schema.components['schemas']['RejectOrderDto']
export type FrameWizardDocumentStatusRequest = schema.components['schemas']['OrderDocumentStatusRequest']
export type FrameWizardStopFactorRequest = schema.components['schemas']['OrderStopFactorRequest']
export type FrameWizardOrderCheckListRequest = schema.components['schemas']['BankOrderCheckListRequest']

export interface FrameWizardParameters {
  bankId?: number | bigint
  orderId?: number
  step?: number
}

export interface FrameWizardsCommonParameters extends FrameWizardParameters {
  type?: FrameWizardType
}

// TODO: ask be to generate typings for this
export interface FrameWizardStep1Response {
  clientCompany: CompanyDto
  customerCompany: CompanyDto
  clientCompanyChief: CompanyFounderDto
  clientCompanyRequisites: CompanyRequisitesDto
}

/**
 * Send wizard step 1
 */
export async function sendFrameWizardStep1(
  params: FrameWizardsCommonParameters,
  request: unknown,
) {
  const { bankId, orderId, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await post(`/bank/${bankId}/wizard/${wizard}/${orderId}/1`, request)
}

/**
 * Send wizard step 2
 */
export async function sendFrameWizardStep2(
  params: FrameWizardsCommonParameters,
  request: unknown,
) {
  const { bankId, orderId, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await post(`/bank/${bankId}/wizard/${wizard}/${orderId}/2`, request)
}

/**
 * Send wizard step 3
 */
export async function sendFrameWizardStep3(
  params: FrameWizardParameters,
  request: unknown,
) {
  const { bankId, orderId } = params
  return await post(`/bank/${bankId}/wizard/frame/${orderId}/3`, request)
}

/**
 * Send wizard step 4
 */
export async function sendFrameWizardStep4(
  params: FrameWizardParameters,
  request: unknown,
) {
  const { bankId, orderId } = params
  return await post(`/bank/${bankId}/wizard/frame/${orderId}/4`, request)
}

/**
 * Send wizard step
 */
export async function sendFrameWizardStep(
  params: FrameWizardsCommonParameters,
  request: unknown
) {
  const { bankId, orderId, step, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await post(`/bank/${bankId}/wizard/${wizard}/${orderId}/${step}`, request)
}

/**
 * Get current step
 */
export async function getCurrentFrameWizardStep(
  params: FrameWizardsCommonParameters,
) {
  const { bankId, orderId, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await get(`/bank/${bankId}/wizard/${wizard}/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFrameWizardStep(
  params: FrameWizardsCommonParameters,
) {
  const { bankId, orderId, step, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await get(`/bank/${bankId}/wizard/${wizard}/${orderId}/${step}`)
}

/**
 * Send order check list
 */
export async function updateFrameWizardCheckList(
  params: FrameWizardsCommonParameters,
  request: FrameWizardOrderCheckListRequest,
) {
  const { bankId, orderId, type } = params
  const wizard = type === FrameWizardType.Simple ? 'frameSimple' : 'frame'
  return await post(`/bank/${bankId}/wizard/${wizard}/${orderId}/checks`, request)
}
