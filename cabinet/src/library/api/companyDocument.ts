import { get, del } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

import { CompanyDocument } from 'library/models/proxy'

export interface CompanyDocumentsListParams {
  companyId: bigint | number
}

export interface CompanyDocumentItemParams {
  companyId: bigint | number
  documentId: bigint | number
}

export const getCompanyDocumentUploadUrl = (
  companyId: bigint | number,
  typeId: number
) => (
  `/client/company/${companyId}/document/${typeId}`
)

export async function getCompanyDocuments(params: CompanyDocumentsListParams) {
  const { companyId } = params
  return await get<CompanyDocument[]>(`/client/company/${companyId}/document`)
}

export async function deleteCompanyDocument(params: CompanyDocumentItemParams) {
  const { companyId, documentId } = params
  return await del(`/client/company/${companyId}/document/${documentId}`)
}

export async function downloadCompanyDocument(params: CompanyDocumentItemParams) {
  const { companyId, documentId } = params
  return await get<File>(`/common/download/company/${companyId}/${documentId}`)
}
