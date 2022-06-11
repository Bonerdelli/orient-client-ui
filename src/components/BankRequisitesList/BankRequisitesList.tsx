import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'
import { remove } from 'lodash'

import { Table, Button, Space, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import ErrorResultView from 'ui-components/ErrorResultView' // TODO: from ui-lib

import { CompanyRequisites } from 'library/models/proxy'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib

import { getCompanyRequisitesList, getCompanyRequisites } from 'library/api'

import './BankRequisitesList.style.less'

export interface BankRequisitesListProps {
  companyId: number
}

const BankRequisitesList: React.FC<BankRequisitesListProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [ data, dataLoaded ] = useApi<CompanyRequisites[]>(getCompanyRequisitesList, { companyId })

  const handleDelete = async (item: CompanyRequisites) => {
    if (data) {
      await getCompanyRequisites({ companyId, id: item.id as number })
      remove(data, (datum) => datum === item)
    }
  }

  const renderActions = (_val: unknown, item: CompanyRequisites) => (
    <Space size="small">
      <Link to={`${url}/${item.id}`}>
        <Button
          key="edit"
          type="link"
          shape="circle"
          title={t('common.actions.edit.title')}
          icon={<EditOutlined />}
        />
      </Link>
      <Popconfirm
        onConfirm={() => handleDelete(item)}
        title={t('common.actions.delete.confirmOne')}
        placement="bottomRight"
        okButtonProps={{
          danger: true,
        }}
      >
        <Button
          key="delete"
          type="link" danger
          shape="circle"
          title={t('common.actions.delete.title')}
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    </Space>
  )

  const columns: ColumnsType<CompanyRequisites> = [
    {
      key: 'bankName',
      dataIndex: 'bankName',
      title: t('bankRequisitesPage.tableColumns.bankName'),
    },
    {
      key: 'mfoNum',
      dataIndex: 'mfo',
      title: t('bankRequisitesPage.tableColumns.mfoNum'),
    },
    {
      key: 'account',
      dataIndex: 'accountNumber',
      title: t('bankRequisitesPage.tableColumns.account'),
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
    <div className="BankRequisitesList" data-testid="BankRequisitesList">
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

export default BankRequisitesList
