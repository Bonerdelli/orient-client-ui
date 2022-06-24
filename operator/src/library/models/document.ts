export enum DocumentStatus {
  Uploaded = 'uploaded',
  NotUploaded = 'notUploaded',
  Approved = 'approved',
  NotApproved = 'not_approved',
}

export interface Document {
  id?: number // NOTE: no identifier for docs that haven't been uploaded
  type: number // keyof typeof DOCUMENT_TYPE
  status: DocumentStatus
  fileId?: number
}
