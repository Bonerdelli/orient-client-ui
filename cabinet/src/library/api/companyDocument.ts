import { get, getFile, del } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

import { CompanyDocument } from 'orient-ui-library/library/models/proxy'

export interface CompanyDocumentsListParams {
  companyId: bigint | number
}

export interface CompanyDocumentItemParams {
  companyId: bigint | number
  documentId: bigint | number
  fileName?: string
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
  const { companyId, documentId, fileName } = params
  return await getFile(`/common/download/company/${companyId}/${documentId}`, fileName)
}
