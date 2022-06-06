import { ApiSuccessResponse, ApiErrorResponse, get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

import { CompanyHead } from 'library/models/proxy' // TODO: move to ui-lib after debugging

// export type CompanyRequest = schema.components['schemas']['']
export type CompanyHeadResponse = schema.components['schemas']['ServerResponseJCompanyFounder']
export type CompanyHeadListResponse = schema.components['schemas']['ServerResponseListJCompanyFounder']
export type CompanyHeadSaveRequest = schema.components['schemas']['CompanyFounderSaveRequest']

export interface GetCompanyHeadsParams {
  companyId: number | bigint
}

export async function getCompanyHeads(params: GetCompanyHeadsParams): Promise<CompanyHead[]> {
  const response = await get<CompanyHeadListResponse>(`/client/company/${params.companyId}`)
  if ((response as CompanyHeadListResponse).data) {
    return (response as CompanyHeadListResponse)?.data ?? []
  }
  return []
}

export interface CompanyHeadCRUDParams {
  companyId: number | bigint
  id: number
}

export async function getCompanyHead(params: CompanyHeadCRUDParams): Promise<CompanyHead | null> {
  const response = await get<CompanyHeadResponse>(`/client/company/${params.companyId}/founder/${params.id}`)
  if ((response as CompanyHeadResponse).data) {
    return (response as CompanyHeadResponse)?.data ?? null
  }
  return null
}

export async function updateCompanyHead(
  request: CompanyHeadSaveRequest,
  params: CompanyHeadCRUDParams
): Promise<CompanyHead | null> {
  const result = await post<CompanyHeadResponse>(`/client/company/${params.companyId}/founder/${params.id}`, request)
  if ((result as CompanyHeadResponse).data) {
    return (result as CompanyHeadResponse).data ?? null
  }
  return null
}
