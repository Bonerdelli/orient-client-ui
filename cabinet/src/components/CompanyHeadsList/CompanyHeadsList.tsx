import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'
import { remove } from 'lodash'

import { Table, Button, Space, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { CompanyHead } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { renderBinaryCell, renderNumericCell } from 'library/helpers/table' // TODO: to ui-lib

import { useStoreState } from 'library/store'
import { getCompanyHeads, deleteCompanyHead } from 'library/api'

import './CompanyHeadsList.style.less'

export interface CompanyHeadsListProps {
  companyId: number
}

export enum PassportType {
  Ru = 'RU',
  Uz = 'UZ',
  Uz_Id = 'UZ_ID',
}

const CompanyHeadsList: React.FC<CompanyHeadsListProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const company = useStoreState(state => state.company.current)
  const [ data, dataLoaded, reloadData ] = useApi<CompanyHead[]>(getCompanyHeads, { companyId })

  const handleEdit = (item: CompanyHead) => {
    // console.log('handleEdit', item)
  }

  const handleDelete = async (item: CompanyHead) => {
    if (data) {
      await deleteCompanyHead({ companyId, id: item.id as number })
      remove(data, (datum) => datum === item)
      reloadData()
    }
  }

  const renderActions = (_val: unknown, item: CompanyHead) => (
    <Space className="DataTable__ghostActions">
      <Link to={`${url}/${item.id}`}>
        <Button
          key="edit"
          type="link"
          shape="circle"
          title={t('common.actions.edit.title')}
          onClick={() => handleEdit(item)}
          icon={<EditOutlined />}
        />
      </Link>
      <Popconfirm
        onConfirm={() => handleDelete(item)}
        title={t('common.actions.delete.confirmOne')}
      >
        <Button
          danger
          key="delete"
          type="link"
          shape="circle"
          title={t('common.actions.delete.title')}
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    </Space>
  )


  const columns: ColumnsType<CompanyHead> = [
    {
      key: 'fullName',
      dataIndex: 'fullName',
      title: t('headsPage.tableColumns.fullName'),
      render: (_, item: CompanyHead) => ([item.lastName, item.firstName, item.secondName].filter(Boolean).join(' ')),
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

  return (
    <div className="CompanyHeadsList" data-testid="CompanyHeadsList">
      <Table
        bordered
        columns={columns}
        loading={dataLoaded === null}
        dataSource={data || []}
        pagination={false}
      />
    </div>
  )
}

export default CompanyHeadsList
