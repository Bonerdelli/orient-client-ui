import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, message } from 'antd'
import { DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

import { Document } from 'library/models'

import './DocumentActions.style.less'

export interface DocumentActionsProps {
  document: Document
  uploadUrl: string
  downloadHandler: (doc: Document) => Promise<boolean>
  approveHandler: (doc: Document) => Promise<boolean>
  rejectHandler: (doc: Document) => Promise<boolean>
  onChange?: () => {}
  loading?: boolean | null
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  document,
  approveHandler,
  rejectHandler,
  downloadHandler,
  onChange,
  loading,
}) => {
  const { t } = useTranslation()
  const [ operationInProccess, setOperationInProccess ] = useState<boolean>()

  const handleDownload = async () => {
    const result = await downloadHandler(document)
    if (!result) {
      message.error(
        t('common.documents.statusMessages.downloadingError')
      )
    }
  }

  const handleApprove = async () => {
    setOperationInProccess(true)
    const result = await approveHandler(document)
    if (!result) {
      message.error(
        t('common.documents.statusMessages.deletingError')
      )
    } else {
      onChange && onChange()
    }
    setOperationInProccess(false)
  }

  const handleReject = async () => {
    setOperationInProccess(true)
    const result = await rejectHandler(document)
    if (!result) {
      message.error(
        t('common.documents.statusMessages.deletingError')
      )
    } else {
      onChange && onChange()
    }
    setOperationInProccess(false)
  }

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

  const renderApproveButton = () => (
    <Button
      key="approve"
      type="link"
      shape="circle"
      loading={operationInProccess}
      title={t('common.actions.approve.title')}
      onClick={handleApprove}
      disabled={loading === true}
      icon={<CheckCircleOutlined />}
    />
  )

  const renderRejectButton = () => (
    <Button
      danger
      key="reject"
      type="link"
      shape="circle"
      loading={operationInProccess}
      title={t('common.actions.reject.title')}
      onClick={handleReject}
      disabled={loading === true}
      icon={<CloseCircleOutlined />}
    />
  )

  return (
    <>
      {renderDownloadButton()}
      {renderApproveButton()}
      {renderRejectButton()}
    </>
  )
}

export default DocumentActions
