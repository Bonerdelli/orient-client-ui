import { get, post, del } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

import { CompanyRequisites } from 'orient-ui-library/library/models/proxy'

export type CompanyRequisitesSaveRequest = schema.components['schemas']['CompanyFounderSaveRequest']

export interface GetCompanyRequisitesBaseParams {
  companyId: number | bigint
}

export async function getCompanyRequisitesList(params: GetCompanyRequisitesBaseParams) {
  return await get<CompanyRequisites[]>(`/client/company/${params.companyId}/requisites`)
}

export interface CompanyRequisitesItemParams {
  companyId: number | bigint
  id: number
}

export async function getCompanyRequisites(params: CompanyRequisitesItemParams) {
  return await get<CompanyRequisites>(`/client/company/${params.companyId}/requisites/${params.id}`)
}

export async function deleteCompanyRequisites(params: CompanyRequisitesItemParams) {
  return await del(`/client/company/${params.companyId}/requisites/${params.id}`)
}

export async function updateCompanyRequisites(
  params: GetCompanyRequisitesBaseParams,
  request: CompanyRequisitesSaveRequest,
) {
  return await post<CompanyRequisites>(`/client/company/${params.companyId}/requisites`, request)
}

export async function addCompanyRequisites(
  params: GetCompanyRequisitesBaseParams,
  request: CompanyRequisitesSaveRequest,
) {
  return await post<CompanyRequisites>(`/client/company/${params.companyId}/requisites`, request)
}
