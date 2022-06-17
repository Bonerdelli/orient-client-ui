import { get, post, del } from 'orient-ui-library/library/helpers/api' // TODO: move to ui-lib after debugging
import * as schema from 'orient-ui-library/library/api/schema' // TODO: move to ui-lib after debugging

import { Document } from 'library/models'

export interface OrderDocumentItemParams {
  companyId: number | bigint
  orderId: number | bigint
}

export interface OrderDocumentAddParams {
  companyId: number | bigint
  orderId: number | bigint
  typeId: number
}

export interface OrderDocumentDeleteParams {
  companyId: number | bigint
  orderId: number | bigint
  docId: number | bigint
}

export const getOrderDocumentUploadUrl = (
  companyId: number | bigint,
  orderId: number | bigint,
  typeId: number,
) => (
  `/client/company/${companyId}/order/${orderId}/document/upload/${typeId}`
)

export async function getOrderDocuments(params: OrderDocumentItemParams) {
  const { companyId, orderId } = params
  return await get<Document[]>(`/client/company/${companyId}/order/${orderId}/document`)
}

// TODO: move out

export const getCompanyDocumentUploadUrl = (
  companyId: number | bigint,
  typeId: number
) => (
  `/client/company/${companyId}/document/${typeId}`
)

export async function getCompanyDocuments(params: OrderDocumentItemParams) {
  const { companyId } = params
  return await get<Document[]>(`/client/company/${companyId}/document`)
}

export async function deleteCompanyDocuments(params: any) {
  const { companyId, docId } = params
  return await del(`/client/company/${companyId}/document/${docId}`)
}
