import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Table, Button, Space, Upload, message } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import type { UploadProps } from 'antd'

import { getEndpointUrl } from 'orient-ui-library/library'

import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'

import Div from 'components/Div' // TODO: ui-lib

import { DOCUMENT_TYPE, Document, DocumentStatus } from 'library/models'
import { getCompanyDocuments, getOrderDocumentUploadUrl, getCompanyDocumentUploadUrl, deleteCompanyDocuments } from 'library/api'
import { useStoreState } from 'library/store'
import { useApi } from 'library/helpers/api'

import './DocumentsList.style.less'

const { Text } = Typography

export interface DocumentsListProps {
  orderId?: number
  customerId?: number
  showHeader?: boolean
  types: number[]
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  orderId,
  // customerId,
  types,
  showHeader,
}) => {
  const { t } = useTranslation()
  const company = useStoreState(state => state.company.current)
  const user = useStoreState(state => state.user)

  const companyId = company?.id

  const [ data, setData ] = useState<Document[]>()
  const [ uploadUrl, setUploadUrl ] = useState<boolean>()
  const [ uploading, setUploading ] = useState<boolean>()

  const [ companyDocuments, _, companyDocumentsReload ] = useApi<Document[]>(getCompanyDocuments, { companyId })

  useEffect(() => {
    const updatedData = types.map(typeId => ({
      id: -1, // TODO: fixme please
      type: typeId,
      status: DocumentStatus.NotUploaded,
    }))
    setData(updatedData)
  }, [types])

  useEffect(() => {
    // console.log('companyDocuments', companyDocuments)
  }, [companyDocuments])

  const getUploadUrl = useCallback((typeId: number) => {
    if (!company) {
      return ''
    }
    let apiPath: string
    const companyId = company?.id as number
    if (orderId) {
      apiPath = getOrderDocumentUploadUrl(companyId, orderId, typeId)
    } else {
      apiPath = getCompanyDocumentUploadUrl(companyId, typeId)
    }
    return getEndpointUrl(apiPath)
  }, [company, orderId])

  const handleDownload = (item: Document) => {
    // console.log('handleDownload', item)
  }

  const handleDelete = async (item: Document) => {
    const existsDoc = companyDocuments?.find((datum: any) => datum.typeId === item.type)?.info
    if (existsDoc) {
      await deleteCompanyDocuments({ companyId, docId: existsDoc.documentId })
      companyDocumentsReload()
    }
  }

  // const canUpload = (doc: Document) => doc.status === DocumentStatus.NotUploaded
  // const canDownload = (doc: Document) => doc.status === DocumentStatus.Uploaded
  // const canDelete = (doc: Document) => doc.status === DocumentStatus.Uploaded

  const canUpload = useCallback((doc: Document) => {
    const existsDoc = companyDocuments?.find((datum: any) => datum.typeId === doc.type)?.info
    return !!existsDoc
  }, [companyDocuments])
  const canDownload = useCallback((doc: Document) => {
    const existsDoc = companyDocuments?.find((datum: any) => datum.typeId === doc.type)?.info
    return !existsDoc
  }, [companyDocuments])
  const canDelete = useCallback((doc: Document) => {
    const existsDoc = companyDocuments?.find((datum: any) => datum.typeId === doc.type)?.info
    return !existsDoc
  }, [companyDocuments])

  const renderDocumentStatus = (status: DocumentStatus, doc) => {
    const existsDoc = companyDocuments?.find((datum: any) => datum.typeId === doc.type)?.info
    if (existsDoc) {
      status = DocumentStatus.Uploaded
    }
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

  const getUploadProps = (typeId: number): UploadProps => ({
    name: 'file',
    action: getUploadUrl(typeId),
    headers: {
      Authorization: `Bearer ${user?.currentAuth?.accessToken}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} успешно загружен`)
        companyDocumentsReload()
      } else if (info.file.status === 'error') {
        message.error(`Ошибка загрузки файла ${info.file.name}`)
      }
    },
    progress: {
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    // TODO: add nice-looking spinner
    itemRender: () => <></>,
    iconRender: () => <></>,
  })

  const renderActions = (_val: unknown, item: Document) => (
    <Space className="DataTable__actions DataTable__ghostActions--">
      {canUpload(item) &&
        <Upload {...getUploadProps(item.type)}>
          <Button
            key="upload"
            type="link"
            shape="circle"
            style={{ display: uploading ? 'none' : 'block' }}
            title={t('common.documents.actions.upload.title')}
            icon={<UploadOutlined />}
          />
        </Upload>
      }
      {!uploading && canDownload(item) &&
        <Button
          key="download"
          type="link"
          shape="circle"
          title={t('common.documents.actions.download.title')}
          onClick={() => handleDownload(item)}
          icon={<DownloadOutlined />}
        />
      }
      {!uploading && canDelete(item) &&
        <Button
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
      title: t('common.documents.fields.type.title'),
      render: (value) => DOCUMENT_TYPE[value],
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: t('common.documents.fields.status.title'),
      render: (s, i) => renderDocumentStatus(s, i),
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
    <Div className="DocumentsList" data-testid="DocumentsList">
      <Table
        size={showHeader ? 'large' : 'middle'}
        className="DocumentsList__table"
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={showHeader}
      />
    </Div>
  )
}

export default DocumentsList
