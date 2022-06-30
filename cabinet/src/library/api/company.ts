import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging
import { CompanyDto } from 'orient-ui-library/library/models/proxy'

export type CompanyPatchShortNameRequest = schema.components['schemas']['PatchShortNameDto']
export type CompanyFactAddressesRequest = schema.components['schemas']['PatchAddressesDto']

export async function getCompany() {
  return await get<CompanyDto[]>('/client/company') // TODO: have no EPs for Customer
}

export interface GetCompanyByIdParams {
  id: number | bigint
}

export async function getCompanyById(params: GetCompanyByIdParams) {
  return await get<CompanyDto>(`/client/company/${params.id}`)
}

export interface SetCompanyShortNameParams {
  companyId: number | bigint
}

export async function setCompanyShortName(
  params: SetCompanyShortNameParams,
  request: CompanyPatchShortNameRequest,
) {
  return await post<CompanyDto>(`/client/company/${params.companyId}/shortName`, request, true)
}

export async function setCompanyFactAddresses(
  companyId: number | bigint,
  request: CompanyFactAddressesRequest,
) {
  return await post(`/client/company/${companyId}/factAddresses`, request, true)
}
