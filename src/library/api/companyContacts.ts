import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

export type CompanyContactsReponse = schema.components['schemas']['ServerResponseJCompanyContacts']
export type CompanyContactsSaveRequest = schema.components['schemas']['CompanyContactsSaveRequest']

export interface CompanyContactsRequestParams {
  companyId: number | bigint
}

export async function getCompanyContacts(params: CompanyContactsRequestParams) {
  return await get<CompanyContactsReponse>(`/client/company/${params.companyId}/contacts`)
}

export async function updateCompanyContacts(
  params: CompanyContactsRequestParams,
  request: CompanyContactsSaveRequest,
) {
  return await post<CompanyContactsReponse>(`/client/company/${params.companyId}/contacts`, request)
}
