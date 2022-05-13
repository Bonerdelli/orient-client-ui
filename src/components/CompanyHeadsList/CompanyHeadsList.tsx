import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { CompanyHead } from 'library/models'
import { renderBinaryCell, renderNumericCell } from 'library/helpers/table'

import './CompanyHeadsList.style.less'
import mockData from 'library/mock/heads' // TODO: integrate with API when ready

export interface CompanyHeadsListProps { }

const CompanyHeadsList: React.FC<CompanyHeadsListProps> = ({}) => {
  const { t } = useTranslation()
  const [ data, setData ] = useState<CompanyHead[]>()

  useEffect(() => {
    setData(mockData)
  }, [ mockData ])

  const handleEdit = (item: CompanyHead) => {
    console.log('handleEdit', item)
  }

  const handleDelete = (item: CompanyHead) => {
    console.log('handleDelete', item)
  }

  const renderActions = (_val: unknown, item: CompanyHead) => (
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


  const columns: ColumnsType<CompanyHead> = [
    {
      key: 'fullName',
      dataIndex: 'fullName',
      title: t('headsPage.tableColumns.fullName'),
    },
    {
      key: 'isExecutive',
      dataIndex: 'isExecutive',
      title: t('headsPage.tableColumns.isExecutive'),
      render: renderBinaryCell,
      align: 'center',
    },
    {
      key: 'isAttorney',
      dataIndex: 'isAttorney',
      title: t('headsPage.tableColumns.isAttorney'),
      render: renderBinaryCell,
      align: 'center',
    },
    {
      key: 'ownership',
      dataIndex: 'ownership',
      title: t('headsPage.tableColumns.ownership'),
      render: renderNumericCell,
      align: 'center',
    },
    {
      key: 'actions',
      render: renderActions,
      align: 'right',
    },
  ]

  return (
    <div className="CompanyHeadsList" data-testid="CompanyHeadsList">
      <Table
        columns={columns}
        dataSource={data}
      />
    </div>
  )
}

export default CompanyHeadsList
