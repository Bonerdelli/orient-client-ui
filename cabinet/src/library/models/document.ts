export enum DocumentStatus {
  Uploaded = 'uploaded',
  NotUploaded = 'notUploaded',
  UploadingError = 'uploadingError',
  Signed = 'signed',
  Unsigned = 'unsigned',
}

export interface Document {
  id?: number // NOTE: no identifier for docs that haven't been uploaded
  type: number
  status: DocumentStatus
  fileId?: number
  name?: string
}
