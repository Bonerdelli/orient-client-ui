import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'

import Div from 'components/Div' // TODO: ui-lib

import { DOCUMENT_TYPE, Document, DocumentStatus } from 'library/models'

import './DocumentsList.style.less'

const { Text } = Typography

export interface DocumentsListProps {
  orderId?: number
  customerId?: number
  types: number[]
}


const DocumentsList: React.FC<DocumentsListProps> = ({
  // orderId,
  // customerId,
  types,
}) => {
  const { t } = useTranslation()
  const [ data, setData ] = useState<Document[]>()

  useEffect(() => {
    const updatedData = types.map(typeId => ({
      id: -1, // TODO: fixme please
      type: typeId,
      status: DocumentStatus.NotUploaded,
    }))
    setData(updatedData)
  }, [types])

  const handleUpload = (item: Document) => {
    console.log('handleUpload', item)
  }

  const handleDownload = (item: Document) => {
    console.log('handleDownload', item)
  }

  const handleDelete = (item: Document) => {
    console.log('handleDelete', item)
  }

  const canUpload = (doc: Document) => doc.status === DocumentStatus.NotUploaded
  const canDownload = (doc: Document) => doc.status === DocumentStatus.Uploaded
  const canDelete = (doc: Document) => doc.status === DocumentStatus.Uploaded

  const renderDocumentStatus = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.Uploaded:
        return <Text>{t('common.documents.statuses.uploaded')}</Text>
      case DocumentStatus.NotUploaded:
        return <Text>{t('common.documents.statuses.notUploaded')}</Text>
      case DocumentStatus.UploadingError:
        return <Text>{t('common.documents.statuses.uploadingError')}</Text>
      case DocumentStatus.Signed:
        return <Text>{t('common.documents.statuses.signed')}</Text>
      case DocumentStatus.Unsigned:
        return <Text>{t('common.documents.statuses.unsigned')}</Text>
    }
  }

  const renderActions = (_val: unknown, item: Document) => (
    <Space className="DataTable__actions">
      {canUpload(item) && <Button
        key="upload"
        type="link"
        shape="circle"
        title={t('common.documents.actions.upload.title')}
        onClick={() => handleUpload(item)}
        icon={<UploadOutlined />}
      />}
      {canDownload(item) && <Button
        key="download"
        type="link"
        shape="circle"
        title={t('common.documents.actions.download.title')}
        onClick={() => handleDownload(item)}
        icon={<DownloadOutlined />}
      />}
      {canDelete(item) && <Button
        danger
        key="delete"
        type="link"
        shape="circle"
        title={t('common.actions.delete.title')}
        onClick={() => handleDelete(item)}
        icon={<DeleteOutlined />}
      />}
    </Space>
  )

  const columns: ColumnsType<unknown> = [
    {
      key: 'type',
      dataIndex: 'type',
      width: 'auto',
      render: (value) => DOCUMENT_TYPE[value],
    },
    {
      key: 'status',
      dataIndex: 'status',
      align: 'right',
      render: renderDocumentStatus,
    },
    {
      key: 'actions',
      width: 60,
      render: renderActions,
      align: 'right',
    },
  ]

  return (
    <Div className="DocumentsList" data-testid="DocumentsList">
      <Table
        size="middle"
        className="DocumentsList__table"
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={false}
      />
    </Div>
  )
}

export default DocumentsList
