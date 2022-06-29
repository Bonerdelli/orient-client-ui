import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

import {
  CompanyRequisites,
  CompanyHead,
  OrderDocument,
  CompanyQuestionnaire,
} from 'orient-ui-library/library/models/proxy'

export type WizardStep1To2Request = schema.components['schemas']['ClientFrameStep1To2Request']

interface FrameWizardCommonParameters {
  type: FrameWizardType
  companyId: number
  orderId?: number
  step?: number
}

export interface FrameWizardStepParameters extends FrameWizardCommonParameters {
  orderId: number
}

// TODO: ask be generate models for this
export interface WizardStep2Data {
  documents: OrderDocument[] | null
  founder: CompanyHead | null
  requisites: CompanyRequisites | null
  questionnaire: CompanyQuestionnaire | null
}

// NOTE: ep's compined with simple wizard
const getBasePath = (companyId: number, type: FrameWizardType) => {
  const typePath = type === FrameWizardType.Full ? 'frame' : 'frameSimple'
  return `/client/company/${companyId}/wizard/${typePath}`
}

/**
 * Wizard start (send step 1)
 */
export async function startFrameWizard(
  params: FrameWizardCommonParameters,
  request: WizardStep1To2Request
) {
  const { companyId, type } = params
  const basePath = getBasePath(companyId, type)
  return await post(basePath, request, true)
}

/**
 * Send wizard step 2
 */
export async function sendFrameWizardStep2(
  params: FrameWizardStepParameters,
  request: unknown
) {
  const { companyId, orderId, type } = params
  const basePath = getBasePath(companyId, type)
  return await post(`${basePath}/${orderId}/2`, request, true)
}

/**
 * Send wizard step 2
 */
export async function sendFrameWizardStep3(
  params: FrameWizardStepParameters,
  request: unknown
) {
  const { companyId, orderId, type } = params
  const basePath = getBasePath(companyId, type)
  return await post(`${basePath}/${orderId}/3`, request, true)
}

/**
 * Send wizard N-th step
 * NOTE: don't care, as BE response have no typings
 */
export async function sendFrameWizardStep(
  params: FrameWizardStepParameters,
  request: unknown
) {
  const { companyId, orderId, step, type } = params
  const basePath = getBasePath(companyId, type)
  return await post(`${basePath}/${orderId}/${step}`, request, true)
}

/**
 * Get current step
 */
export async function getCurrentFrameWizardStep(
  params: FrameWizardCommonParameters,
) {
  const { companyId, orderId, type } = params
  const basePath = getBasePath(companyId, type)
  return await get(`${basePath}/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFrameWizardStep(
  params: FrameWizardCommonParameters,
) {
  const { companyId, orderId, type, step } = params
  const basePath = getBasePath(companyId, type)
  return await get(`${basePath}/${orderId}/${step}`)
}
