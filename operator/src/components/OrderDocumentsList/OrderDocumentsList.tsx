import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { isUndefined } from 'lodash'

import { OrderDocument } from 'orient-ui-library/library/models/document'
import Div from 'orient-ui-library/components/Div'

import DocumentActions from 'components/DocumentActions'
import { Document, DocumentStatus } from 'library/models'
import { downloadOrderDocument } from 'library/api/orderDocument'

import './OrderDocumentsList.style.less'

export interface OrderDocumentsListProps {
  orderId: number
  types: number[]
  current?: OrderDocument[]
  setStatusHandler: (
    documentId: number | bigint,
    status: DocumentStatus,
  ) => Promise<boolean>
  onChange?: () => {}
}

const OrderDocumentsList: React.FC<OrderDocumentsListProps> = (props) => {
  const { orderId, types, current, setStatusHandler, onChange } = props
  const { t } = useTranslation()

  const [ items, setItems ] = useState<Document[]>()

  useEffect(() => {
    if (!current) {
      return
    }
    const updatedItems = types.map(typeId => {
      const existsDoc = current?.find((datum) => datum.typeId === typeId)
      return composeDocument(typeId, existsDoc)
    })
    setItems(updatedItems)
  }, [types, current])

  const composeDocument = (typeId: number, document?: OrderDocument): Document => {
    if (!document?.info) {
      return {
        type: typeId,
        title: document?.typeName,
        status: DocumentStatus.NotUploaded,
      }
    }
    return {
      type: typeId,
      title: document.typeName, // NOTE: this is cyrillic doc name, eg. Устав компании
      id: document.info.documentId,
      status: document.info.documentStatus as DocumentStatus || DocumentStatus.NotViewed,
    }
  }

  const handleItemApprove = async (item: Document) => {
    const documentId = item.id as number
    const result = await setStatusHandler(documentId, DocumentStatus.Approved)
    return result
  }

  const handleItemReject = async (item: Document) => {
    const documentId = item.id as number
    const result = await setStatusHandler(documentId, DocumentStatus.NotApproved)
    return result
  }

  const handleItemDownload = async (item: Document) => {
    const documentId = item.id as number
    const result = await downloadOrderDocument({
      orderId,
      documentId,
      fileName: item.title,
    })
    return result
  }

  const renderDocumentStatus = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.NotViewed:
        return <Tag>{t('common.documents.statuses.notViewed')}</Tag>
      case DocumentStatus.Approved:
        return <Tag color="green">{t('common.documents.statuses.approved')}</Tag>
      case DocumentStatus.NotApproved:
      return <Tag color="red">{t('common.documents.statuses.notApproved')}</Tag>
      default:
        return <></>
    }
  }

  const renderActions = (_val: unknown, item: Document) => (
    <Space className="DataTable__actions DataTable__ghostActions--">
      <DocumentActions
        document={item}
        approveHandler={handleItemApprove}
        rejectHandler={handleItemReject}
        downloadHandler={handleItemDownload}
        onChange={onChange}
      />
    </Space>
  )

  const columns: ColumnsType<Document> = [
    {
      key: 'title',
      dataIndex: 'title',
      width: 'auto',
      title: t('common.documents.fields.type.title'),
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: t('common.documents.fields.status.title'),
      render: renderDocumentStatus,
      width: 100,
      align: 'center',
    },
    {
      key: 'actions',
      render: renderActions,
      title: t('common.dataEntity.actions'),
      align: 'right',
      width: 80,
    },
  ]

  return (
    <Div className="OrderDocumentsList" data-testid="OrderDocumentsList">
      <Table
        size={'middle'}
        loading={isUndefined(current)}
        className="OrderDocumentsList__table"
        columns={columns}
        dataSource={items}
        pagination={false}
        showHeader={false}
        rowKey="type"
      />
    </Div>
  )
}

export default OrderDocumentsList
