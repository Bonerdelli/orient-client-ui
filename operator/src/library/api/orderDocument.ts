import {
  ApiSuccessResponse,
  FileLocation,
  getS3File,
  get,
} from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging

export interface OrderDocumentItemParams {
  orderId: number | bigint
  documentId: bigint | number
  fileName?: string
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
