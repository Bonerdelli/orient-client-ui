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
  downloadHandler: (doc: Document) => Promise<boolean>
  onUploadSuccess?: () => {}
  onUploadError?: () => {}
  onChange?: () => {}
  loading?: boolean | null
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  uploadUrl,
  deleteHandler,
  downloadHandler,
  onChange,
  onUploadSuccess,
  onUploadError,
  loading,
}) => {
  const { t } = useTranslation()
  const user = useStoreState(state => state.user)
  const [ operationInProccess, setOperationInProccess ] = useState<boolean>()

  const canUpload = () => document.status === DocumentStatus.NotUploaded
  const canDownload = () => document.status === DocumentStatus.Uploaded
  const canDelete = () => document.status === DocumentStatus.Uploaded

  const getUploadProps = (_typeId: number): UploadProps => ({
    name: 'file',
    action: uploadUrl,
    headers: {
      Authorization: `Bearer ${user?.currentAuth?.accessToken}`,
    },
    onChange(info) {
      if (!operationInProccess) {
        setOperationInProccess(true)
      }
      if (info.file.status === 'done') {
        handleUploadSuccess(info.file.name)
      } else if (info.file.status === 'error') {
        handleUploadError(info.file.name)
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

  const handleUploadSuccess = (fileName: string) => {
    message.success(t(
      'common.documents.statusMessages.uploaded',
      { name: fileName },
    ))
    setOperationInProccess(false)
    onUploadSuccess && onUploadSuccess()
    onChange && onChange()
  }

  const handleUploadError = (fileName: string) => {
    message.error(t(
      'common.documents.statusMessages.uploadingError',
      { name: fileName },
    ))
    setOperationInProccess(false)
    onUploadError && onUploadError()
  }

  const handleDownload = async () => {
    const result = await downloadHandler(document)
    if (!result) {
      message.error(
        t('common.documents.statusMessages.downloadingError')
      )
    }
  }

  const handleDelete = async () => {
    setOperationInProccess(true)
    const result = await deleteHandler(document)
    if (!result) {
      message.error(
        t('common.documents.statusMessages.deletingError')
      )
    } else {
      onChange && onChange()
    }
    setOperationInProccess(false)
  }

  const renderAddButton = () => (
    <Upload {...getUploadProps(document.type)}>
      <Button
        key="upload"
        type="link"
        shape="circle"
        loading={operationInProccess}
        title={t('common.documents.actions.upload.title')}
        disabled={loading === true}
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
      onClick={handleDownload}
      disabled={loading === true}
      icon={<DownloadOutlined />}
    />
  )

  const renderDeleteButton = () => (
    <Button
      danger
      key="delete"
      type="link"
      shape="circle"
      loading={operationInProccess}
      title={t('common.actions.delete.title')}
      onClick={handleDelete}
      disabled={loading === true}
      icon={<DeleteOutlined />}
    />
  )

  return (
    <>
      {canUpload() && renderAddButton()}
      {canDownload() && renderDownloadButton()}
      {canDelete() && renderDeleteButton()}
    </>
  )
}

export default DocumentActions
