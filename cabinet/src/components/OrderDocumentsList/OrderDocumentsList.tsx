import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { isUndefined } from 'lodash'

import { getEndpointUrl } from 'orient-ui-library/library'

import Div from 'orient-ui-library/components/Div'
import DocumentActions from 'components/DocumentActions'

import { Document, DocumentStatus } from 'library/models'
import { OrderDocument } from 'orient-ui-library/library/models/document'

import {
  getOrderDocumentUploadUrl,
  deleteOrderDocument,
  downloadOrderDocument,
} from 'library/api'

import './OrderDocumentsList.style.less'

export interface OrderDocumentsListProps {
  companyId: number
  orderId: number
  types: number[]
  current?: OrderDocument[]
  onChange?: () => {}
}

const OrderDocumentsList: React.FC<OrderDocumentsListProps> = (props) => {
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

  const getUploadUrl = useCallback((typeId: number) => {
    const apiPath = getOrderDocumentUploadUrl(companyId, orderId, typeId)
    return getEndpointUrl(apiPath)
  }, [companyId, orderId])

  const handleItemDelete = async (item: Document) => {
    const documentId = item.id as number
    const result = await deleteOrderDocument({
      companyId,
      orderId,
      documentId,
    })
    item.status = DocumentStatus.NotUploaded
    return result
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

  const renderDocumentStatus = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.Uploaded:
        return <Tag color="green">{t('common.documents.statuses.uploaded')}</Tag>
      case DocumentStatus.NotUploaded:
        return <Tag>{t('common.documents.statuses.notUploaded')}</Tag>
      case DocumentStatus.UploadingError:
        return <Tag color="red">{t('common.documents.statuses.uploadingError')}</Tag>
      case DocumentStatus.Signed:
        return <Tag color="green">{t('common.documents.statuses.signed')}</Tag>
      case DocumentStatus.Unsigned:
        return <Tag>{t('common.documents.statuses.unsigned')}</Tag>
    }
  }


  const renderActions = (_val: unknown, item: Document) => (
    <Space className="DataTable__actions DataTable__ghostActions--">
      <DocumentActions
        document={item}
        uploadUrl={getUploadUrl(item.type)}
        deleteHandler={handleItemDelete}
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
      render: renderDocumentStatus,
      width: 120,
      align: 'center',
    },
    {
      key: 'actions',
      render: renderActions,
      title: t('common.dataEntity.actions'),
      align: 'center',
      width: 100,
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
