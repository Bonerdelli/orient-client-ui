import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Space, Tag, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/lib/table'
import { isUndefined } from 'lodash'

import { OrderDocument } from 'orient-ui-library/library/models/document'
import Div from 'orient-ui-library/components/Div'

import { Document, DocumentStatus } from 'library/models'
import { downloadOrderDocument } from 'library/api/orderDocument'

import './OrderDocumentsList.style.less'

export interface OrderDocumentsListProps {
  orderId: number
  types: number[]
  current?: OrderDocument[]
  checkSignNeededFn?: (document?: OrderDocument) => boolean,
  checkSignedFn?: (document?: OrderDocument) => boolean,
}

const OrderDocumentsList: React.FC<OrderDocumentsListProps> = (props) => {
  const { orderId, types, current, checkSignNeededFn, checkSignedFn } = props
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
      status: document.info.clientSigned
        ? DocumentStatus.Signed
        : DocumentStatus.Unsigned,
    }
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

  const renderDocumentStatus = (document: Document) => {
    let isSigned: boolean
    const orderDocument = current?.find(item => item.typeId === document.type)
    if (checkSignedFn) {
      isSigned = orderDocument ? checkSignedFn(orderDocument) : false
    } else {
      isSigned = orderDocument?.info?.bankSigned ?? false
    }
    if (checkSignNeededFn && !checkSignNeededFn(orderDocument)) {
      return <></>
    }
    if (isSigned) {
      return <Tag>{t('common.documents.statuses.signed')}</Tag>
    }
    return <Tag>{t('common.documents.statuses.unsigned')}</Tag>
  }

  const renderActions = (_val: unknown, item: Document) => (
    <Space className="DataTable__actions DataTable__ghostActions--">
      {item.status !== DocumentStatus.NotUploaded && (
        <Button
          key="download"
          type="link"
          shape="circle"
          title={t('common.documents.actions.download.title')}
          onClick={() => handleItemDownload(item)}
          icon={<DownloadOutlined />}
        />
      )}
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
      render: (_, item) => renderDocumentStatus(item),
      align: 'center',
      width: 100,
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
