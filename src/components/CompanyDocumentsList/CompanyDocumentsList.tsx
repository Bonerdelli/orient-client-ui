import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Table, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'

import { getEndpointUrl } from 'orient-ui-library/library'

import Div from 'components/Div' // TODO: ui-lib
import DocumentActions from 'components/DocumentActions'

import { DOCUMENT_TYPE, Document, DocumentStatus } from 'library/models'
import { CompanyDocument } from 'library/models/proxy'
import { useStoreState } from 'library/store'
import { useApi } from 'library/helpers/api'

import {
  getCompanyDocuments,
  // getOrderDocumentUploadUrl,
  getCompanyDocumentUploadUrl,
  deleteCompanyDocument,
  downloadCompanyDocument,
} from 'library/api'

import './CompanyDocumentsList.style.less'

const { Text } = Typography

export interface CompanyDocumentsListProps {
  orderId?: number
  customerId?: number
  showHeader?: boolean
  types: number[]
}

const CompanyDocumentsList: React.FC<CompanyDocumentsListProps> = ({
  orderId,
  // customerId,
  types,
  showHeader,
}) => {
  const { t } = useTranslation()
  const company = useStoreState(state => state.company.current)
  const companyId = company?.id as number

  const [ items, setItems ] = useState<Document[]>()

  const [
    companyDocuments,
    documentsLoading,
    companyDocumentsReload,
  ] = useApi<CompanyDocument[]>(getCompanyDocuments, { companyId })

  useEffect(() => {
    if (companyDocuments === null) {
      return
    }
    const updatedItems = types.map(typeId => {
      const existsDoc = companyDocuments?.find((datum) => datum.typeId === typeId)
      return composeDocument(typeId, existsDoc)
    })
    setItems(updatedItems)
  }, [types, documentsLoading, companyDocuments])

  const composeDocument = (typeId: number, document?: CompanyDocument): Document => {
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
    // if (orderId) {
    //   apiPath = getOrderDocumentUploadUrl(companyId, orderId, typeId)
    // }
    const apiPath = getCompanyDocumentUploadUrl(companyId, typeId)
    return getEndpointUrl(apiPath)
  }, [company, orderId])

  const handleItemDelete = async (item: Document) => {
    const result = await deleteCompanyDocument({ companyId, documentId: item.id as number })
    return result
  }

  const handleItemDownload = async (item: Document) => {
    const result = await downloadCompanyDocument({ companyId, documentId: item.id as number })
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
        onChange={companyDocumentsReload}
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


  // TODO: 'middle' for order docs
  return (
    <Div className="CompanyDocumentsList" data-testid="CompanyDocumentsList">
      <Table
        size={'large'}
        loading={documentsLoading === true}
        className="CompanyDocumentsList__table"
        columns={columns}
        dataSource={items}
        pagination={false}
        showHeader={showHeader}
      />
    </Div>
  )
}

export default CompanyDocumentsList
