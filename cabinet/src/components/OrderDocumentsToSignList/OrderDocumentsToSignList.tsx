import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Tag, Table, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { isUndefined } from 'lodash'

import Div from 'orient-ui-library/components/Div'
import DocumentActions from 'components/DocumentActions'

import { OrderDocument } from 'orient-ui-library/library/models/document'
import { Document, DocumentStatus } from 'library/models'
import { downloadOrderDocument } from 'library/api'

import './OrderDocumentsToSignList.style.less'

export interface OrderDocumentsToSignListProps {
  companyId: number
  orderId: number
  types: number[]
  current?: OrderDocument[]
  checkSignNeededFn?: (document?: OrderDocument) => boolean,
  checkSignedFn?: (document: OrderDocument) => boolean,
  onChange?: () => {}
}

const OrderDocumentsToSignList: React.FC<OrderDocumentsToSignListProps> = (props) => {
  const { companyId, orderId, types, current, onChange, checkSignNeededFn, checkSignedFn } = props
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
        status: DocumentStatus.NotUploaded,
        name: document?.typeName,
      }
    }
    return {
      type: typeId,
      name: document.typeName, // NOTE: this is cyrillic doc name, eg. Устав компании
      id: document.info.documentId,
      status: DocumentStatus.Uploaded,
    }
  }

  const isSignedFn = (status?: DocumentStatus) => status === DocumentStatus.Signed

  const renderDocumentStatus = (document: Document) => {
    let isSigned: boolean
    const orderDocument = current?.find(item => item.typeId === document.type)
    if (checkSignedFn) {
      isSigned = orderDocument ? checkSignedFn(orderDocument) : false
    } else {
      isSigned = isSignedFn(document.status as DocumentStatus)
    }
    if (checkSignNeededFn && !checkSignNeededFn(orderDocument)) {
      return <></>
    }
    if (isSigned) {
      return <Tag>{t('common.documents.statuses.signed')}</Tag>
    }
    return <Tag>{t('common.documents.statuses.unsigned')}</Tag>
  }

  const handleItemDownload = async (item: Document) => {
    const documentId = item.id as number
    const result = await downloadOrderDocument({
      companyId,
      orderId,
      documentId,
      fileName: item.name,
    })
    return result
  }

  const renderActions = (_val: unknown, item: Document) => (
    <Space className="DataTable__actions DataTable__ghostActions--">
      <DocumentActions
        document={item}
        downloadHandler={handleItemDownload}
        onChange={onChange}
      />
    </Space>
  )

  const columns: ColumnsType<Document> = [
    {
      key: 'name',
      dataIndex: 'name',
      width: 'auto',
      title: t('common.documents.fields.type.title'),
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: t('common.documents.fields.status.title'),
      render: (_, item) => renderDocumentStatus(item),
      align: 'center',
      width: 160,
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
    <Div className="OrderDocumentsToSignList" data-testid="OrderDocumentsToSignList">
      <Table
        size={'middle'}
        loading={isUndefined(current)}
        className="OrderDocumentsToSignList__table"
        columns={columns}
        dataSource={items}
        pagination={false}
        showHeader={false}
        rowKey="type"
      />
    </Div>
  )
}

export default OrderDocumentsToSignList
