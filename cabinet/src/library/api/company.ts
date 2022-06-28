import { get, post } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

import { Company } from 'orient-ui-library/library/models/proxy'

export type CompanyPatchShortNameRequest = schema.components['schemas']['PatchShortNameDto']

export async function getCompany() {
  return await get<Company[]>('/client/company')
}

export interface GetCompanyByIdParams {
  id: number | bigint
}

export async function getCompanyById(params: GetCompanyByIdParams) {
  return await get<Company>(`/client/company/${params.id}`)
}

export interface SetCompanyShortNameParams {
  companyId: number | bigint
}

export async function setCompanyShortName(
  params: SetCompanyShortNameParams,
  request: CompanyPatchShortNameRequest,
) {
  return await post<Company>(`/client/company/${params.companyId}/shortName`, request, true)
}
