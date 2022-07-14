import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'
import { remove } from 'lodash'

import { Button, message, Popconfirm, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { CompanyHead } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { renderBinaryCell, renderNumericCell } from 'library/helpers/table' // TODO: to ui-lib
import { deleteCompanyHead, getCompanyHeads } from 'library/api'

import './CompanyHeadsList.style.less'
import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'

export interface CompanyHeadsListProps {
  companyId: number
}

const CompanyHeadsList: React.FC<CompanyHeadsListProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [ data, dataLoaded, reloadData ] = useApi<CompanyFounderDto[] | null>(getCompanyHeads, { companyId })

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
          icon={<EditOutlined/>}
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
          icon={<DeleteOutlined/>}
        />
      </Popconfirm>
    </Space>
  )


  const columns: ColumnsType<CompanyHead> = [
    {
      key: 'fullName',
      dataIndex: 'fullName',
      title: t('headsPage.tableColumns.fullName'),
      render: (_, item: CompanyHead) => ([ item.lastName, item.firstName, item.secondName ].filter(Boolean).join(' ')),
    },
    {
      key: 'isIo',
      dataIndex: 'isIo',
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
      title: t('common.dataEntity.actions'),
      align: 'center',
      width: 100,
    },
  ]

  if (dataLoaded === false) {
    message.error(t('Ошибка получения данных о руководителях и учредителях'))
  }

  return (
    <div className="CompanyHeadsList" data-testid="CompanyHeadsList">
      <Table
        columns={columns}
        loading={dataLoaded === null}
        dataSource={data ?? []}
        pagination={false}
      />
    </div>
  )
}

export default CompanyHeadsList
