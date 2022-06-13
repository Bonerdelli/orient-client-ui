import { get, post, del } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

import { CompanyHead } from 'library/models/proxy' // TODO: move to ui-lib after debugging

export type CompanyHeadSaveRequest = schema.components['schemas']['CompanyFounderSaveRequest']

export interface GetCompanyHeadsParams {
  companyId: number | bigint
}

export async function getCompanyHeads(params: GetCompanyHeadsParams) {
  return await get<CompanyHead[]>(`/client/company/${params.companyId}/founder`)
}

export interface CompanyHeadItemParams {
  companyId: number | bigint
  id: number
}

export async function getCompanyHead(params: CompanyHeadItemParams) {
  return await get<CompanyHead>(`/client/company/${params.companyId}/founder/${params.id}`)
}

export async function deleteCompanyHead(params: CompanyHeadItemParams) {
  return await del(`/client/company/${params.companyId}/founder/${params.id}`)
}

export async function updateCompanyHead(
  params: CompanyHeadItemParams,
  request: CompanyHeadSaveRequest,
) {
  return await post<CompanyHead>(`/client/company/${params.companyId}/founder/${params.id}`, request)
}
