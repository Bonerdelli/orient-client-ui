import { ApiSuccessResponse, ApiErrorResponse, get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

export type CompanyContactsReponse = schema.components['schemas']['ServerResponseJCompanyContacts']
export type CompanyContactsSaveRequest = schema.components['schemas']['CompanyContactsSaveRequest']

import { CompanyContacts } from 'library/models/proxy'

export interface CompanyContactsRequestParams {
  companyId: number | bigint
}

export async function getCompanyContacts(params: CompanyContactsRequestParams): Promise<CompanyContacts | null> {
  // TODO: add generic for API error response using axios model
  const response = await get<CompanyContactsReponse>(`/client/company/${params.companyId}/contacts`)
  if ((response as CompanyContactsReponse).data) {
    return (response as CompanyContactsReponse)?.data ?? null
  }
  return null
}

export async function updateCompanyContacts(
  request: CompanyContactsSaveRequest,
  params: CompanyContactsRequestParams
): Promise<boolean> {
  const result = await post<ApiSuccessResponse>(`/client/company/${params.companyId}/contacts`, request)
  if ((result as ApiErrorResponse).error) {
    return false
  }
  return true
}
