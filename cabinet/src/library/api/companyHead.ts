import { del, get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging
import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'

export type CompanyHeadSaveRequest = schema.components['schemas']['CompanyFounderSaveRequest']

export interface CompanyHeadsParams {
  companyId: number | bigint
}

export async function getCompanyHeads(params: CompanyHeadsParams) {
  return await get<CompanyFounderDto[]>(`/client/company/${params.companyId}/founder`)
}

export interface CompanyHeadItemParams {
  companyId: number | bigint
  id: number
}

export async function getCompanyHead(params: CompanyHeadItemParams) {
  return await get<CompanyFounderDto>(`/client/company/${params.companyId}/founder/${params.id}`)
}

export async function deleteCompanyHead(params: CompanyHeadItemParams) {
  return await del(`/client/company/${params.companyId}/founder/${params.id}`)
}

export async function updateCompanyHead(
  params: CompanyHeadsParams,
  request: CompanyHeadSaveRequest,
) {
  return await post<CompanyFounderDto>(`/client/company/${params.companyId}/founder`, request, true)
}
