import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderDocument } from 'orient-ui-library/library/models/document'

import { CabinetMode } from 'library/models/cabinet'

import {
  CompanyFounderDto,
  CompanyQuestionnaireDto,
  CompanyRequisitesDto,
} from 'orient-ui-library/library/models/proxy'

export type WizardStep1To2Request = schema.components['schemas']['ClientFrameStep1To2Request']

export interface WizardStep4Request {
  bankId: number
}

interface FrameWizardCommonParameters {
  type: FrameWizardType
  companyId: number
  mode?: CabinetMode,
  orderId?: number
  step?: number
}

export interface FrameWizardStepParameters extends FrameWizardCommonParameters {
  orderId: number
}

// TODO: ask be generate models for this
export interface WizardStep2Data {
  documents: OrderDocument[] | null
  founder: CompanyFounderDto | null
  requisites: CompanyRequisitesDto | null
  questionnaire: CompanyQuestionnaireDto | null
}

// NOTE: API wrappers for Frame and Simple Frame are combined
// NOTE: some API wrappers for Client and Customer are combined
const getBasePath = (
  companyId: number | bigint,
  type: FrameWizardType,
  mode: CabinetMode = CabinetMode.Client,
) => {
  const modePath = mode === CabinetMode.Customer ? 'customer' : 'client'
  const typePath = type === FrameWizardType.Full ? 'frame' : 'frameSimple'
  return `/${modePath}/company/${companyId}/wizard/${typePath}`
}

/**
 * Wizard start (send step 1)
 */
export async function startFrameWizard(
  params: FrameWizardCommonParameters,
  request: WizardStep1To2Request,
) {
  const { mode, companyId, type } = params
  const basePath = getBasePath(companyId, type, mode)
  return await post(basePath, request)
}

/**
 * Send wizard step 2
 */
export async function sendFrameWizardStep2(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { mode, companyId, orderId, type } = params
  const basePath = getBasePath(companyId, type, mode)
  return await post(`${basePath}/${orderId}/2`, request)
}

/**
 * Send wizard step 2
 */
export async function sendFrameWizardStep3(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { mode, companyId, orderId, type } = params
  const basePath = getBasePath(companyId, type, mode)
  return await post(`${basePath}/${orderId}/3`, request)
}

/**
 * Send wizard step 4
 */
export async function sendFrameWizardStep4(
  params: FrameWizardStepParameters,
  request: WizardStep4Request,
) {
  const { mode, companyId, orderId, type } = params
  const basePath = getBasePath(companyId, type, mode)
  return await post(`${basePath}/${orderId}/4`, request)
}

/**
 * Send wizard N-th step
 * NOTE: don't care, as BE response have no typings
 */
export async function sendFrameWizardStep(
  params: FrameWizardStepParameters,
  request: unknown,
) {
  const { mode, companyId, orderId, step, type } = params
  const basePath = getBasePath(companyId, type, mode)
  return await post(`${basePath}/${orderId}/${step}`, request)
}

/**
 * Get current step
 */
export async function getCurrentFrameWizardStep(
  params: FrameWizardCommonParameters,
) {
  const { mode, companyId, orderId, type } = params
  const basePath = getBasePath(companyId, type, mode)
  return await get(`${basePath}/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFrameWizardStep(
  params: FrameWizardCommonParameters,
) {
  const { mode, companyId, orderId, type, step } = params
  const basePath = getBasePath(companyId, type, mode)
  return await get(`${basePath}/${orderId}/${step}`)
}
