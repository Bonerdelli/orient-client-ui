import { ApiSuccessResponse, get, getS3File, del } from 'orient-ui-library/library/helpers/api'
import { CompanyDocument } from 'orient-ui-library/library/models/proxy'
import * as schema from 'orient-ui-library/library/api/schema'

type FileLocation = schema.components['schemas']['FileLocation']

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
  const response = await get<FileLocation>(`/common/download/company/${companyId}/${documentId}`)
  const location = (response as ApiSuccessResponse<FileLocation>)?.data?.location ?? null
  if (!location || !response.success) {
    throw new Error('Document downloading error')
  }
  return getS3File(location, fileName)
}
