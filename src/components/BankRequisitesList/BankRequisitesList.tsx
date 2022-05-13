import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { BankRequisites } from 'library/models'

import './BankRequisitesList.style.less'
import mockData from 'library/mock/bankRequisites' // TODO: integrate with API when ready

export interface BankRequisitesListProps { }

const BankRequisitesList: React.FC<BankRequisitesListProps> = ({}) => {
  const { t } = useTranslation()
  const [ data, setData ] = useState<BankRequisites[]>()

  useEffect(() => {
    setData(mockData)
  }, [ mockData ])

  const handleEdit = (item: BankRequisites) => {
    console.log('handleEdit', item)
  }

  const handleDelete = (item: BankRequisites) => {
    console.log('handleDelete', item)
  }

  const renderActions = (_val: unknown, item: BankRequisites) => (
    <Space className="DataTable__actions">
      <Button
        key="edit"
        type="primary"
        shape="circle"
        title={t('common.actions.edit.title')}
        onClick={() => handleEdit(item)}
        icon={<EditOutlined />}
      />
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


  const columns: ColumnsType<BankRequisites> = [
    {
      key: 'bankName',
      dataIndex: 'bankName',
      title: t('bankRequisitesPage.tableColumns.bankName'),
    },
    {
      key: 'mfoNum',
      dataIndex: 'mfoNum',
      title: t('bankRequisitesPage.tableColumns.mfoNum'),
    },
    {
      key: 'account',
      dataIndex: 'account',
      title: t('bankRequisitesPage.tableColumns.account'),
    },
    {
      key: 'actions',
      render: renderActions,
      align: 'right',
    },
  ]

  return (
    <div className="BankRequisitesList" data-testid="BankRequisitesList">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  )
}

export default BankRequisitesList
