import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Table, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { isUndefined } from 'lodash'

import { getEndpointUrl } from 'orient-ui-library/library'

import Div from 'orient-ui-library/components/Div' // TODO: ui-lib
import DocumentActions from 'components/DocumentActions'

import { DOCUMENT_TYPE, Document, DocumentStatus } from 'library/models'
import { OrderDocument } from 'library/models/proxy'

import {
  getOrderDocumentUploadUrl,
  deleteOrderDocument,
  downloadOrderDocument,
} from 'library/api'

import './OrderStepDocumentsList.style.less'

const { Text } = Typography

export interface OrderDocumentsListProps {
  companyId: number
  orderId: number
  types: number[]
  current?: OrderDocument[]
  onChange: () => {}
}

const OrderStepDocumentsList: React.FC<OrderDocumentsListProps> = (props) => {
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
    return result
  }

  const handleItemDownload = async (item: Document) => {
    const documentId = item.id as number
    const result = await downloadOrderDocument({
      companyId,
      orderId,
      documentId,
    })
    return result as any // TODO: check this
  }

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

  const columns: ColumnsType<unknown> = [
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
    <Div className="OrderStepDocumentsList" data-testid="OrderStepDocumentsList">
      <Table
        size={'middle'}
        loading={isUndefined(current)}
        className="OrderDocumentsList__table"
        columns={columns}
        dataSource={items}
        pagination={false}
        showHeader={false}
      />
    </Div>
  )
}

export default OrderStepDocumentsList
