import { get /*, post */ } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

// export type CompanyRequest = schema.components['schemas']['']
export type CompanyResponse = schema.components['schemas']['ServerResponseJCompany']
export type CompanyResult = schema.components['schemas']['ServerResponseJCompany']

export async function getCompany(): Promise<CompanyResult> {
  return await get<CompanyResult>('/client/company') as CompanyResult // TODO: remove ErrorResult support!
}

export interface GetCompanyByIdParams {
  id: number | bigint
}

export async function getCompanyById(params: GetCompanyByIdParams): Promise<CompanyResult> {
  return await get<CompanyResult>(`/client/company/${params.id}`) as CompanyResult
}
