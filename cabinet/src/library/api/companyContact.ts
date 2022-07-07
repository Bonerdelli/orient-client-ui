import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging
import { CompanyContactsDto } from 'orient-ui-library/library/models/proxy'

export type CompanyContactsSaveRequest = schema.components['schemas']['CompanyContactsSaveRequest']

export interface CompanyContactsRequestParams {
  companyId: number | bigint
}

export async function getCompanyContacts(params: CompanyContactsRequestParams) {
  return await get<CompanyContactsDto>(`/client/company/${params.companyId}/contacts`)
}

export async function updateCompanyContacts(
  params: CompanyContactsRequestParams,
  request: CompanyContactsSaveRequest,
) {
  return await post<CompanyContactsDto>(`/client/company/${params.companyId}/contacts`, request, true)
}
