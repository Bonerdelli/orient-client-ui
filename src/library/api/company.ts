import { ApiSuccessResponse, ApiErrorResponse, get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

// import { Company } from 'library/models/proxy' // TODO: move to ui-lib after debugging

// export type CompanyRequest = schema.components['schemas']['']
export type CompanyResponse = schema.components['schemas']['ServerResponseJCompany']
export type CompanyListResponse = schema.components['schemas']['ServerResponseListJCompany']
export type CompanyResult = schema.components['schemas']['ServerResponseJCompany']

export async function getCompany(): Promise<CompanyListResponse> {
  // TODO: add generic for API error response using axios model
  return await get<CompanyListResponse>('/client/company') as CompanyListResponse
}

export interface GetCompanyByIdParams {
  id: number | bigint
}

export async function getCompanyById(params: GetCompanyByIdParams): Promise<CompanyResponse> {
  return await get<CompanyResponse>(`/client/company/${params.id}`) as CompanyResponse // TODO: API error generic type
}

export interface SetCompanyShortNameParams {
  id: number | bigint
  value: string
}

export async function setCompanyShortName(params: SetCompanyShortNameParams): Promise<boolean> {
  const result = await post<ApiSuccessResponse>(`/client/company/${params.id}/shortName`, params)
  if ((result as ApiErrorResponse).error) {
    return false
  }
  return true
}
