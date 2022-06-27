import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Table, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { isUndefined } from 'lodash'

import { getEndpointUrl } from 'orient-ui-library/library'

import Div from 'orient-ui-library/components/Div'
import DocumentActions from 'components/DocumentActions'

import { DOCUMENT_TYPE, Document, DocumentStatus } from 'library/models'
import { OrderDocument } from 'orient-ui-library/library/models/proxy'

import {
  getOrderDocumentUploadUrl,
  downloadOrderDocument,
} from 'library/api'

import './OrderDocumentsToSignList.style.less'

const { Text } = Typography

export interface OrderDocumentsToSignListProps {
  companyId: number
  orderId: number
  types: number[]
  current?: OrderDocument[]
  onChange?: () => {}
}

const OrderDocumentsToSignList: React.FC<OrderDocumentsToSignListProps> = (props) => {
  const { companyId, orderId, types, current, onChange } = props
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
      }
    }
    return {
      type: typeId,
      name: document.typeName, // NOTE: this is cyrillic doc name, eg. Устав компании
      id: document.info.documentId,
      status: DocumentStatus.Uploaded,
    }
  }

  const getUploadUrl = useCallback((typeId: number) => {
    const apiPath = getOrderDocumentUploadUrl(companyId, orderId, typeId)
    return getEndpointUrl(apiPath)
  }, [companyId, orderId])


  const renderDocumentStatus = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.Signed:
        return <Text>{t('common.documents.statuses.signed')}</Text>
      case DocumentStatus.Unsigned:
        return <Text>{t('common.documents.statuses.unsigned')}</Text>
      default:
        return <></>
    }
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
        uploadUrl={getUploadUrl(item.type)}
        downloadHandler={handleItemDownload}
        onChange={onChange}
      />
    </Space>
  )

  const columns: ColumnsType<Document> = [
    {
      key: 'type',
      dataIndex: 'type',
      width: 'auto',
      title: t('common.documents.fields.type.title'),
      render: (value) => DOCUMENT_TYPE[value],
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
