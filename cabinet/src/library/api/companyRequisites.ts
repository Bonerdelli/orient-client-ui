import { get, post, del } from 'orient-ui-library/library/helpers/api'
import * as schema from 'orient-ui-library/library/api/schema'

import { CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'

export type CompanyRequisitesSaveRequest = schema.components['schemas']['CompanyFounderSaveRequest']

export interface GetCompanyRequisitesBaseParams {
  companyId: number | bigint
}

export async function getCompanyRequisitesList(params: GetCompanyRequisitesBaseParams) {
  return await get<CompanyRequisitesDto[]>(`/client/company/${params.companyId}/requisites`)
}

export interface CompanyRequisitesItemParams {
  companyId: number | bigint
  id: number
}

export async function getCompanyRequisites(params: CompanyRequisitesItemParams) {
  return await get<CompanyRequisitesDto>(`/client/company/${params.companyId}/requisites/${params.id}`)
}

export async function deleteCompanyRequisites(params: CompanyRequisitesItemParams) {
  return await del(`/client/company/${params.companyId}/requisites/${params.id}`)
}

export async function updateCompanyRequisites(
  params: GetCompanyRequisitesBaseParams,
  request: CompanyRequisitesSaveRequest,
) {
  return await post<CompanyRequisitesDto>(`/client/company/${params.companyId}/requisites`, request, true)
}

export async function addCompanyRequisites(
  params: GetCompanyRequisitesBaseParams,
  request: CompanyRequisitesSaveRequest,
) {
  return await post<CompanyRequisitesDto>(`/client/company/${params.companyId}/requisites`, request, true)
}
