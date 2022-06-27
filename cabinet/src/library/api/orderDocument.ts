import {
  ApiSuccessResponse,
  FileLocation,
  get,
  getS3File,
  del,
} from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

import { OrderDocument } from 'orient-ui-library/library/models/proxy'

export interface OrderDocumentListParams {
  companyId: number | bigint
  orderId: number | bigint
}

export interface OrderDocumentItemParams {
  companyId: number | bigint
  orderId: number | bigint
  documentId: bigint | number
  fileName?: string
}

export const getOrderDocumentUploadUrl = (
  companyId: number | bigint,
  orderId: number | bigint,
  typeId: number,
) => (
  `/client/company/${companyId}/order/${orderId}/document/upload/${typeId}`
)

export async function getOrderDocuments(params: OrderDocumentListParams) {
  const { companyId, orderId } = params
  return await get<OrderDocument[]>(`/client/company/${companyId}/order/${orderId}/document`)
}

export async function deleteOrderDocument(params: OrderDocumentItemParams) {
  const { companyId, documentId, orderId } = params
  return await del(`/client/company/${companyId}/order/${orderId}/document/${documentId}`)
}

export async function downloadOrderDocument(params: OrderDocumentItemParams) {
  const { orderId, documentId, fileName } = params
  const response = await get<FileLocation>(`/common/download/order/${orderId}/${documentId}`)
  const location = (response as ApiSuccessResponse<FileLocation>)?.data?.location ?? null
  if (!location || !response.success) {
    throw new Error('Document downloading error')
  }
  return getS3File(location, fileName)
}
