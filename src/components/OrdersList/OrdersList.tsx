import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import ErrorResultView from 'ui-components/ErrorResultView' // TODO: from ui-lib

import { Order } from 'library/models/order'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib

import { getCompanyOrdersList, deleteCompanyOrder } from 'library/api'

import './OrdersList.style.less'

export interface OrdersListProps {
  companyId: number
}

const OrdersList: React.FC<OrdersListProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [ data, dataLoaded, dataReloadCallback ] = useApi<Order[]>(getCompanyOrdersList, { companyId })

  const handleDelete = async (item: Order) => {
    if (data) {
      await deleteCompanyOrder({ companyId, id: item.id as number })
      dataReloadCallback()
    }
  }

  const renderActions = (_val: unknown, item: Order) => (
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

  const columns: ColumnsType<Order> = [
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
      width: 100,
    },
  ]

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  return (
    <div className="OrdersList" data-testid="OrdersList">
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

export default OrdersList
