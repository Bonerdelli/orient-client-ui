export enum DocumentStatus {
  Uploaded = 'uploaded',
  NotUploaded = 'notUploaded',
  Approved = 'approved',
  NotApproved = 'not_approved',
}

export interface Document {
  id?: number | bigint // NOTE: no identifier for docs that haven't been uploaded
  type: number // keyof typeof DOCUMENT_TYPE
  title?: string
  fileName?: string
  status: DocumentStatus
  fileId?: number
}
