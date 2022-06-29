export enum DocumentStatus {
  NotUploaded = 'notUploaded',
  Signed = 'signed',
  Unsigned = 'unsigned',
}

// TODO: move to ui-lib?
export interface Document {
  id?: number | bigint // NOTE: no identifier for docs that haven't been uploaded
  type: number // keyof typeof DOCUMENT_TYPE
  title?: string
  fileName?: string
  status: DocumentStatus
  fileId?: number
}
