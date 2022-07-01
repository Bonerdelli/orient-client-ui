export enum DocumentStatus {
  NotViewed = 'not_viewed',
  Approved = 'approved',
  NotApproved = 'not_approved',
  NotUploaded = 'not_uploaded',
}

export interface Document {
  id?: number | bigint // NOTE: no identifier for docs that haven't been uploaded
  type: number // keyof typeof DOCUMENT_TYPE
  title?: string
  fileName?: string
  status: DocumentStatus
  fileId?: number
}
