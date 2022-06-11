import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import ErrorResultView from 'ui-components/ErrorResultView' // TODO: from ui-lib

import { CompanyHead } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { renderBinaryCell, renderNumericCell } from 'library/helpers/table' // TODO: to ui-lib

import { useStoreState } from 'library/store'
import { getCompanyHeads } from 'library/api'

import './CompanyHeadsList.style.less'

export interface CompanyHeadsListProps {
  companyId: number

}

const CompanyHeadsList: React.FC<CompanyHeadsListProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const company = useStoreState(state => state.company.current)
  const [ data, dataLoaded ] = useApi<CompanyHead[]>(getCompanyHeads, { companyId })

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

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  console.log('data', data)

  return (
    <div className="CompanyHeadsList" data-testid="CompanyHeadsList">
      <Table
        columns={columns}
        loading={dataLoaded === null}
        dataSource={data || []}
        pagination={false}
      />
    </div>
  )
}

export default CompanyHeadsList
