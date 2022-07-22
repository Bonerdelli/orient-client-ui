import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'

import { getEndpointUrl } from 'orient-ui-library/library'

import Div from 'orient-ui-library/components/Div'
import DocumentActions from 'components/DocumentActions'

import { Document, DocumentStatus } from 'library/models'
import { CompanyDocumentDto } from 'orient-ui-library/library/models/proxy'
import { useApi } from 'library/helpers/api'

import {
  deleteCompanyDocument,
  downloadCompanyDocument,
  getCompanyDocuments,
  getCompanyDocumentUploadUrl,
} from 'library/api'

import './CompanyDocumentsList.style.less'

export interface CompanyDocumentsListProps {
  compact?: boolean
  companyId: number
  types?: number[]
}

const CompanyDocumentsList: React.FC<CompanyDocumentsListProps> = (props) => {
  const { compact, companyId, types } = props
  const { t } = useTranslation()

  const [ items, setItems ] = useState<Document[]>()

  const [
    companyDocuments,
    documentsLoaded,
    companyDocumentsReload,
  ] = useApi<CompanyDocumentDto[]>(getCompanyDocuments, { companyId })

  useEffect(() => {
    if (companyDocuments === null) {
      return
    }
    const updatedItems =companyDocuments
      .filter(document => types ? types.includes(document.typeId) : true)
      .map(document => {
        return composeDocument(document.typeId, document)
      })
    setItems(updatedItems)
  }, [ types, documentsLoaded, companyDocuments ])

  const composeDocument = (typeId: number, document: CompanyDocumentDto): Document => {
    if (!document?.info && document?.type) {
      return {
        type: typeId,
        name: document.type,
        status: DocumentStatus.NotUploaded,
      }
    }
    return {
      type: typeId,
      name: document.type,
      id: document.info?.documentId,
      status: DocumentStatus.Uploaded,
    }
  }

  const getUploadUrl = useCallback((typeId: number) => {
    const apiPath = getCompanyDocumentUploadUrl(companyId, typeId)
    return getEndpointUrl(apiPath)
  }, [ companyId ])

  const handleItemDelete = async (item: Document) => {
    const result = await deleteCompanyDocument({ companyId, documentId: item.id as number })
    return result
  }

  const handleItemDownload = async (item: Document) => {
    const result = await downloadCompanyDocument({
      companyId,
      documentId: item.id as number,
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
        return <Tag>{t('common.documents.statuses.signed')}</Tag>
      case DocumentStatus.Unsigned:
        return <Tag>{t('common.documents.statuses.unsigned')}</Tag>
    }
  }

  const renderActions = (_val: unknown, item: Document) => (
    <Space className="DataTable__actions DataTable__ghostActions--">
      <DocumentActions
        document={item}
        loading={!documentsLoaded}
        uploadUrl={getUploadUrl(item.type)}
        deleteHandler={handleItemDelete}
        downloadHandler={handleItemDownload}
        onChange={companyDocumentsReload}
      />
    </Space>
  )

  const columns: ColumnsType<unknown> = [
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
      align: 'center',
    },
    {
      key: 'actions',
      render: renderActions,
      title: t('common.dataEntity.actions'),
      align: 'left',
      width: 100,
    },
  ]

  return (
    <Div className="CompanyDocumentsList" data-testid="CompanyDocumentsList">
      <Table
        size={compact ? 'middle' : 'large'}
        showHeader={!compact}
        loading={documentsLoaded === null}
        className="CompanyDocumentsList__table"
        columns={columns}
        dataSource={items}
        pagination={false}
        rowKey="typeId"
      />
    </Div>
  )
}

export default CompanyDocumentsList
