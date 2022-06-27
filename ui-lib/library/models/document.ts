export interface OrderDocumentInfo {
  documentId: number | bigint
  documentStatus: string
  /** Format: uuid */
  fileId: string
  fileStatus: string
  createdAt: Date
  clientSigned: boolean
  bankSigned: boolean
  customerSigned: boolean
  /** Format: int64 */
  bankId?: number | bigint
}

export interface OrderDocument {
  typeId: number
  typeName: string
  isGenerated: boolean
  isRequired: boolean
  info?: OrderDocumentInfo
}
