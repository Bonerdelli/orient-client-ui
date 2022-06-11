import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

export type WizardStep1To2Request = schema.components['schemas']['ClientFrameStep1To2Request']

const getBasePath = (companyId: number) => `/client/company/${companyId}/wizard/frame`

interface WizardCommonParameters {
  companyId: number
}

interface WizardStepParameters extends WizardCommonParameters {
  orderId: number
}

/**
 * Wizard start (step 1)
 */
export async function startWizard(
  params: WizardCommonParameters,
  request: WizardStep1To2Request
) {
  const { companyId } = params
  const basePath = getBasePath(companyId)
  return await post(basePath, request)
}

/**
 * Send wizard step 2
 */
export async function sendStep2(
  params: WizardStepParameters,
  request: unknown
) {
  const { companyId, orderId } = params
  const basePath = getBasePath(companyId)
  return await post(`${basePath}/${orderId}/2`, request)
}

/**
 * Send wizard step 2
 */
export async function sendStep3(
  params: WizardStepParameters,
  request: unknown
) {
  const { companyId, orderId } = params
  const basePath = getBasePath(companyId)
  return await post(`${basePath}/${orderId}/3`, request)
}

/**
 * Gwt current step
 */
export async function getCurrentStep(
  params: WizardCommonParameters,
) {
  const { companyId } = params
  const basePath = getBasePath(companyId)
  return await get(basePath)
}
