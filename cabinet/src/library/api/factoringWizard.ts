import { get, post } from 'orient-ui-library/library/helpers/api'

import {
  CompanyRequisites,
  CompanyHead,
  OrderDocument,
  CompanyQuestionnaire,
} from 'orient-ui-library/library/models/proxy'

interface FactoringWizardCommonParameters {
  companyId: number
  orderId?: number
  step?: number
}

export interface FactoringWizardStepParameters extends FactoringWizardCommonParameters {
  orderId: number
}

// TODO: ask be generate models for this
export interface WizardStep2Data {
  documents: OrderDocument[] | null
  founder: CompanyHead | null
  requisites: CompanyRequisites | null
  questionnaire: CompanyQuestionnaire | null
}

const getBasePath = (companyId: number) => {
  return `/client/company/${companyId}/wizard/factor`
}

/**
 * Send wizard N-th step
 * NOTE: don't care, as BE response have no typings
 */
export async function sendFactoringWizardStep(
  params: FactoringWizardStepParameters,
  request: unknown
) {
  const { companyId, orderId, step } = params
  const basePath = getBasePath(companyId)
  return await post(`${basePath}/${orderId}/${step}`, request, true)
}

/**
 * Get current step
 */
export async function getCurrentFactoringWizardStep(
  params: FactoringWizardCommonParameters,
) {
  const { companyId, orderId } = params
  const basePath = getBasePath(companyId)
  return await get(`${basePath}/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFactoringWizardStep(
  params: FactoringWizardCommonParameters,
) {
  const { companyId, orderId, step } = params
  const basePath = getBasePath(companyId)
  return await get(`${basePath}/${orderId}/${step}`)
}
