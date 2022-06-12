import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import Div from 'components/Div' // TODO: ui-lib

import { DOCUMENT_TYPE, Document } from 'library/models'

import './DocumentsList.style.less'

const { Paragraph } = Typography

export interface DocumentsListProps {
  orderId: number
  customerId: number
  types: number[]
}



const DocumentsList: React.FC<DocumentsListProps> = ({
  orderId,
  customerId,
  types,
}) => {
  const { t } = useTranslation()
  const [ data, setData ] = useState<Document>()

  useEffect(() => {

  }, [types])

  const handleDelete = (item: Document) => {
    console.log('handleDelete', item)
  }

  const renderActions = (_val: unknown, item: Document) => (
    <Space className="DataTable__actions">
      <Button
        key="delete"
        type="primary" danger
        shape="circle"
        title={t('common.actions.delete.title')}
        onClick={() => handleDelete(item)}
        icon={<DeleteOutlined />}
      />
    </Space>
  )

  const columns: ColumnsType<unknown> = [
    {
      key: 'type',
      dataIndex: 'type',
      title: t('__.tableColumns.bankName'),
      render: (value) => DOCUMENT_TYPE[value],
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: t('__.tableColumns.status'),
    },
    {
      key: 'actions',
      render: renderActions,
      align: 'right',
    },
  ]


  return (
    <Div className="DocumentsList" data-testid="DocumentsList">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Div>
  )
}

export default DocumentsList
