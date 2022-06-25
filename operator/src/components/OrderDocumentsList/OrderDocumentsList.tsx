import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Table, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { isUndefined } from 'lodash'

import { OrderDocument } from 'orient-ui-library/library/models/proxy'
import Div from 'orient-ui-library/components/Div' // TODO: ui-lib

import DocumentActions from 'components/DocumentActions'
import { Document, DocumentStatus } from 'library/models'
import { downloadOrderDocument } from 'library/api/orderDocument'

import './OrderDocumentsList.style.less'

const { Text } = Typography

export interface OrderDocumentsListProps {
  orderId: number
  types: number[]
  current?: OrderDocument[]
  setStatusHandler: (
    documentId: number,
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
        title: document?.typeName, // NOTE: this is cyrillic doc name, eg. Устав компании
        status: DocumentStatus.NotUploaded,
      }
    }
    return {
      type: typeId,
      title: document.typeName, // NOTE: this is cyrillic doc name, eg. Устав компании
      id: document.info.documentId,
      status: DocumentStatus.Uploaded,
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
      case DocumentStatus.NotUploaded:
        return <Text>{t('common.documents.statuses.notUploaded')}</Text>
      case DocumentStatus.Uploaded:
        return <Text>{t('common.documents.statuses.notChecked')}</Text>
      case DocumentStatus.Approved:
      case DocumentStatus.NotApproved:
        return <Text>{t('common.documents.statuses.checked')}</Text>
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
      align: 'center',
    },
    {
      key: 'actions',
      width: 120,
      render: renderActions,
      align: 'right',
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
