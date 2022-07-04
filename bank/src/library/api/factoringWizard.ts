import { get, post } from 'orient-ui-library/library/helpers/api'

import { OrderDocument } from 'orient-ui-library/library/models/document'

import {
  CompanyFounderDto,
  CompanyQuestionnaireDto,
  CompanyRequisitesDto,
} from 'orient-ui-library/library/models/proxy'

interface FactoringWizardCommonParameters {
  bankId: number
  orderId?: number
  step?: number
}

export interface FactoringWizardStepParameters extends FactoringWizardCommonParameters {
  orderId: number
}

// TODO: ask be generate models for this
export interface WizardStep2Data {
  documents: OrderDocument[] | null
  founder: CompanyFounderDto | null
  requisites: CompanyRequisitesDto | null
  questionnaire: CompanyQuestionnaireDto | null
}

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
  return await post(`${basePath}/${orderId}/${step}`, request, true)
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
