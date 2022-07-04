import { get, post } from 'orient-ui-library/library/helpers/api'
import { CabinetMode } from 'library/models/cabinet'
import * as schema from 'orient-ui-library/library/api/schema'
import { FactoringWizardStepResponse, OrderConditions } from 'orient-ui-library/library'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { FrameOrderForFactoringDto } from 'library/models/orders'

interface FactoringWizardCommonParameters {
  companyId: number
  mode?: CabinetMode,
  orderId?: number
  step?: number
}

export interface FactoringWizardStepParameters extends FactoringWizardCommonParameters {
  orderId: number
}

export type FactoringWizardStep1To2RequestDto = schema.components['schemas']['ClientFactorStep1To2Request']
export type InitFactoringWizardResponseDto = schema.components['schemas']['ClientFactorStep1To2Response']

// TODO: ask be generate models for this
export type FactoringWizardStep1ResponseDto = FactoringWizardStepResponse<FactoringWizardStep1Dto>
export type FactoringWizardStep2ResponseDto = FactoringWizardStepResponse<FactoringWizardStep2Dto>

export interface FactoringWizardStep1Dto extends Omit<FactoringWizardStep1To2RequestDto, 'bankId' | 'orderId'> {
  bank: {
    bankId: number,
    bankName: string
    conditions: OrderConditions
  }
  frameOrder: FrameOrderForFactoringDto
}

export interface FactoringWizardStep2Dto {
  documents: OrderDocument[] | null
}

// NOTE: some API wrappers for Client and Customer are combined
const getBasePath = (companyId: number | bigint, mode: CabinetMode = CabinetMode.Client) => {
  const modePath = mode === CabinetMode.Customer ? 'customer' : 'client'
  return `/${modePath}/company/${companyId}/wizard/factor`
}

/**
 * Send initial setup of wizard
 */
export async function initFactoringWizard(
  params: Omit<FactoringWizardStepParameters, 'orderId'>,
  request: FactoringWizardStep1To2RequestDto,
) {
  const { mode, companyId } = params
  return post<InitFactoringWizardResponseDto>(
    getBasePath(companyId, mode),
    request,
    true,
  )
}

/**
 * Send wizard N-th step
 * NOTE: don't care, as BE response have no typings
 */
export async function sendFactoringWizardStep(
  params: FactoringWizardStepParameters,
  request: unknown,
) {
  const { mode, companyId, orderId, step } = params
  const basePath = getBasePath(companyId, mode)
  return await post(`${basePath}/${orderId}/${step}`, request, true)
}

/**
 * Get current step
 */
export async function getCurrentFactoringWizardStep(
  params: FactoringWizardCommonParameters,
) {
  const { mode, companyId, orderId } = params
  const basePath = getBasePath(companyId, mode)
  return await get(`${basePath}/${orderId}`)
}

/**
 * Get wizard step by number
 */
export async function getFactoringWizardStep<T = any>(
  params: FactoringWizardCommonParameters,
) {
  const { mode, companyId, orderId, step } = params
  const basePath = getBasePath(companyId, mode)
  return await get<T>(`${basePath}/${orderId}/${step}`)
}
