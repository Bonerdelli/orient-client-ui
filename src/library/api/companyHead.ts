import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

export type CompanyHeadResponse = schema.components['schemas']['ServerResponseJCompanyFounder']
export type CompanyHeadListResponse = schema.components['schemas']['ServerResponseListJCompanyFounder']
export type CompanyHeadSaveRequest = schema.components['schemas']['CompanyFounderSaveRequest']

export interface GetCompanyHeadsParams {
  companyId: number | bigint
}

export async function getCompanyHeads(params: GetCompanyHeadsParams) {
  return await get<CompanyHeadListResponse>(`/client/company/${params.companyId}`)
}

export interface CompanyHeadSaveParams {
  companyId: number | bigint
  id: number
}

export async function getCompanyHead(params: CompanyHeadSaveParams) {
  return await get<CompanyHeadResponse>(`/client/company/${params.companyId}/founder/${params.id}`)
}

export async function updateCompanyHead(
  params: CompanyHeadSaveParams,
  request: CompanyHeadSaveRequest,
) {
  return await post<CompanyHeadResponse>(`/client/company/${params.companyId}/founder/${params.id}`, request)
}
