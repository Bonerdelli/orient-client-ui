import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

export type WizardStep1To2Request = schema.components['schemas']['ClientFrameStep1To2Request']

export enum FrameWizardType {
  Simple,
  Full,
}

interface FrameWizardCommonParameters {
  type: FrameWizardType
  companyId: number
}

export interface FrameWizardStepParameters extends FrameWizardCommonParameters {
  orderId: number
}

const getBasePath = (companyId: number, type: FrameWizardType) => {
  const typePath = type === FrameWizardType.Full ? 'frame' : 'frameSimple'
  return `/client/company/${companyId}/wizard/${typePath}`
}

/**
 * Wizard start (step 1)
 */
export async function startFrameWizard(
  params: FrameWizardCommonParameters,
  request: WizardStep1To2Request
) {
  const { companyId, type } = params
  const basePath = getBasePath(companyId, type)
  return await post(basePath, request)
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
  return await post(`${basePath}/${orderId}/2`, request)
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
  return await post(`${basePath}/${orderId}/3`, request)
}

/**
 * Gwt current step
 */
export async function getCurrentFrameWizardStep(
  params: FrameWizardCommonParameters,
) {
  const { companyId, type } = params
  const basePath = getBasePath(companyId, type)
  return await get(basePath)
}
