export enum DocumentStatus {
  NotUploaded = 'notUploaded',
  Signed = 'signed',
  Unsigned = 'unsigned',
}

export interface Document {
  id?: number | bigint // NOTE: no identifier for docs that haven't been uploaded
  type: number
  title?: string
  fileName?: string
  status: DocumentStatus
  fileId?: number
}
