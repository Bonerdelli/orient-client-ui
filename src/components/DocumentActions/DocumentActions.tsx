import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Upload, message } from 'antd'
import type { UploadProps } from 'antd'
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'

import { Document, DocumentStatus } from 'library/models'
import { useStoreState } from 'library/store'

import './DocumentActions.style.less'

export interface DocumentActionsProps {
  document: Document
  uploadUrl: string
  deleteHandler: (doc: Document) => Promise<boolean>
  downloadHandler: (doc: Document) => Promise<File>
  onChange: () => {}
  onUploadSuccess?: () => {}
  onUploadError?: () => {}
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  uploadUrl,
  deleteHandler,
  downloadHandler,
  onChange,
  onUploadSuccess,
  onUploadError,
}) => {
  const { t } = useTranslation()
  const user = useStoreState(state => state.user)
  const [ uploading, setUploading ] = useState<boolean>()

  const canUpload = () => document.status === DocumentStatus.NotUploaded
  const canDownload = () => document.status === DocumentStatus.Uploaded
  const canDelete = () => document.status === DocumentStatus.Uploaded

  const getUploadProps = (typeId: number): UploadProps => ({
    name: 'file',
    action: uploadUrl,
    headers: {
      Authorization: `Bearer ${user?.currentAuth?.accessToken}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} успешно загружен`)
        onUploadSuccess && onUploadSuccess()
        onChange && onChange()
      } else if (info.file.status === 'error') {
        message.error(`Ошибка загрузки файла ${info.file.name}`)
        onUploadError && onUploadError()
      }
    },
    progress: {
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    // TODO: add nice-looking spinner
    itemRender: () => <></>,
    iconRender: () => <></>,
  })

  const renderAddButton = () => (
    <Upload {...getUploadProps(document.type)}>
      <Button
        key="upload"
        type="link"
        shape="circle"
        style={{ display: uploading ? 'none' : 'block' }}
        title={t('common.documents.actions.upload.title')}
        icon={<UploadOutlined />}
      />
    </Upload>
  )

  const renderDownloadButton = () => (
    <Button
      key="download"
      type="link"
      shape="circle"
      title={t('common.documents.actions.download.title')}
      onClick={() => downloadHandler(document)}
      icon={<DownloadOutlined />}
    />
  )

  const renderDeleteButton = () => (
    <Button
      danger
      key="delete"
      type="link"
      shape="circle"
      title={t('common.actions.delete.title')}
      onClick={() => deleteHandler(document)}
      icon={<DeleteOutlined />}
    />
  )

  return (
    <>
      {canUpload() && renderAddButton}
      {!uploading && canDownload() && renderDownloadButton}
      {!uploading && canDelete() && renderDeleteButton}
    </>
  )
}

export default DocumentActions
