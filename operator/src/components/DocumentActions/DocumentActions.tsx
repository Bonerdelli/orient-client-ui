import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, message } from 'antd'
import { DownloadOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'

import { Document, DocumentStatus } from 'library/models'

import './DocumentActions.style.less'

export interface DocumentActionsProps {
  document: Document
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
  const [ approveInProccess, setApproveInProccess ] = useState<boolean>()
  const [ rejectInProccess, setRejectInProccess ] = useState<boolean>()

  const handleDownload = async () => {
    const result = await downloadHandler(document)
    if (!result) {
      message.error(
        t('common.documents.statusMessages.downloadingError')
      )
    }
  }

  const handleApprove = async () => {
    setApproveInProccess(true)
    const result = await approveHandler(document)
    if (!result) {
      message.error(
        t('common.errors.requestError.title')
      )
    } else {
      onChange && onChange()
    }
    setApproveInProccess(false)
  }

  const handleReject = async () => {
    setRejectInProccess(true)
    const result = await rejectHandler(document)
    if (!result) {
      message.error(
        t('common.errors.requestError.title')
      )
    } else {
      onChange && onChange()
    }
    setRejectInProccess(false)
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
      loading={approveInProccess}
      title={t('common.actions.approve.title')}
      onClick={handleApprove}
      disabled={loading === true || rejectInProccess || document.status === DocumentStatus.Approved}
      icon={<CheckCircleTwoTone twoToneColor={document.status !== DocumentStatus.Approved ? '#52c41a' : '#ccc' } />}
    />
  )

  const renderRejectButton = () => (
    <Button
      danger
      key="reject"
      type="link"
      shape="circle"
      loading={rejectInProccess}
      title={t('common.actions.reject.title')}
      onClick={handleReject}
      disabled={loading === true || approveInProccess || document.status === DocumentStatus.NotApproved}
      icon={<CloseCircleTwoTone twoToneColor={document.status !== DocumentStatus.NotApproved ? '#e83030' : '#ccc' } />}
    />
  )

  return (
    <Div className="DocumentActions">
      {document.status !== DocumentStatus.NotUploaded && renderDownloadButton()}
      {document.status !== DocumentStatus.NotUploaded && renderApproveButton()}
      {document.status !== DocumentStatus.NotUploaded && renderRejectButton()}
    </Div>
  )
}

export default DocumentActions
