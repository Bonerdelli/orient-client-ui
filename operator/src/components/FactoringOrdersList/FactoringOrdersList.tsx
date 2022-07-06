import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Button, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FactoringStatus, Order, OrderStatus } from 'orient-ui-library/library/models/order'

import OrderStatusTag from 'components/OrderStatusTag'
import { GridResponse } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { formatDate } from 'orient-ui-library/library/helpers/date'

import { getFactoringOrdersList } from 'library/api/factoring'

import './FactoringOrdersList.style.less'

export interface FactoringOrdersListProps {

}

const FactoringOrdersList: React.FC<FactoringOrdersListProps> = ({}) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [
    data,
    dataLoaded,
  ] = useApi<GridResponse<Order[]>>(
    getFactoringOrdersList, {},
  )

  const renderActions = (_val: unknown, item: Order) => (
    <Space size="small">
      <Link to={`${url}/${item.id}`}>
        <Button
          key="view"
          type="link"
          shape="circle"
          title={t('common.actions.view.title')}
          icon={<EyeOutlined/>}
        />
      </Link>
    </Space>
  )

  const renderStatus = (statusCode: OrderStatus, item: Order) => (
    <OrderStatusTag statusCode={statusCode} item={item}/>
  )

  const columns: ColumnsType<Order> = [
    {
      key: 'number',
      dataIndex: 'id',
      title: t('frameOrdersPage.tableColumnTitles.id'),
      align: 'center',
    },
    {
      key: 'clientInn',
      dataIndex: 'clientInn',
      title: t('frameOrdersPage.tableColumnTitles.clientInn'),
      align: 'left',
    },
    {
      key: 'clientName',
      dataIndex: 'clientName',
      title: t('frameOrdersPage.tableColumnTitles.clientName'),
      align: 'left',
    },
    {
      key: 'updatedAt', // TODO: is it status updated time?
      dataIndex: 'updatedAt',
      title: t('frameOrdersPage.tableColumnTitles.updatedAt'),
      render: (val) => formatDate(val, { includeTime: true }),
      align: 'center',
    },
    {
      key: 'statusCode',
      dataIndex: 'statusCode',
      title: t('frameOrdersPage.tableColumnTitles.statusName'),
      render: renderStatus,
      align: 'center',
    },
    {
      key: 'actions',
      render: renderActions,
      align: 'right',
      width: 50,
    },
  ]

  const rowClassName = (record: Order) => (
    record.statusCode === FactoringStatus.FACTOR_OPERATOR_WAIT_FOR_VERIFY
      ? 'FactoringOrdersList__row--new'
      : ''
  )

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error"/>
    )
  }

  return (
    <div className="FactoringOrdersList" data-testid="FactoringOrdersList">
      <Table
        size="middle"
        columns={columns}
        loading={dataLoaded === null}
        dataSource={data?.data as unknown as Order[] || []}
        rowClassName={rowClassName}
        pagination={false}
        rowKey="id"
      />
    </div>
  )
}

export default FactoringOrdersList
