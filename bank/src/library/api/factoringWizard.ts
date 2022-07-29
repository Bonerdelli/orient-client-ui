import { get, post } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

import { FactoringWizardStepResponse } from 'orient-ui-library/library'
import { BankFactoringWizardStep1Dto, BankFactoringWizardStep2Dto } from 'library/models/factoringWizard'

export type FactoringOrderCheckListRequest = schema.components['schemas']['BankOrderCheckListRequest']

interface FactoringWizardCommonParameters {
  bankId: number
  orderId?: number
  step?: number
}

export interface FactoringWizardStepParameters extends FactoringWizardCommonParameters {
  orderId: number
}

export type BankFactoringWizardStep1ResponseDto = FactoringWizardStepResponse<BankFactoringWizardStep1Dto>
export type BankFactoringWizardStep2ResponseDto = FactoringWizardStepResponse<BankFactoringWizardStep2Dto>

// NOTE: some API wrappers for Client and Customer are combined
const getBasePath = (bankId: number | bigint) => {
  return `/bank/${bankId}/wizard/factor`
}

/**
 * Send wizard N-th step
 * NOTE: don't care, as BE response have no typings
 */
export async function sendFactoringWizardStep(
  params: FactoringWizardStepParameters,
  request: unknown,
) {
  const { bankId, orderId, step } = params
  const basePath = getBasePath(bankId)
  return await post(`${basePath}/${orderId}/${step}`, request)
}

/**
 * Get current step
 */
export async function getCurrentFactoringWizardStep(
  params: FactoringWizardCommonParameters,
) {
  const { bankId, orderId } = params
  const basePath = getBasePath(bankId)
  return await get(`${basePath}/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFactoringWizardStep(
  params: FactoringWizardCommonParameters,
) {
  const { bankId, orderId, step } = params
  const basePath = getBasePath(bankId)
  return await get(`${basePath}/${orderId}/${step}`)
}

/**
 * Send order check list
 */
export async function updateFrameWizardCheckList(
  params: FactoringWizardCommonParameters,
  request: FactoringOrderCheckListRequest,
) {
  const { bankId, orderId } = params
  const basePath = getBasePath(bankId)
  return await post(`${basePath}/${orderId}/checks`, request)
}
