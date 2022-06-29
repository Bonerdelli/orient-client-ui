import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { Order, OrderStatus } from 'orient-ui-library/library/models/order'
import { formatDate } from 'orient-ui-library/library/helpers/date'

import OrderStatusTag from 'components/OrderStatusTag'
import { GridResponse } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib

import { getFrameSimpleOrdersList } from 'library/api/frameSimpleOrder'
import { MOCK_BANK_ID } from 'library/mock/bank'

import './FrameSimpleOrdersList.style.less'

export interface FrameSimpleOrdersListProps {

}

const FrameSimpleOrdersList: React.FC<FrameSimpleOrdersListProps> = ({}) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [
    data,
    dataLoaded,
  ] = useApi<GridResponse<Order[]>>(
    getFrameSimpleOrdersList, {
      bankId: MOCK_BANK_ID,
    },
  )

  const renderStatus = (statusCode: OrderStatus, item: Order) => (
    <OrderStatusTag statusCode={statusCode} item={item} />
  )

  const renderActions = (_val: unknown, item: Order) => (
    <Space size="small">
      <Link to={`${url}/${item.id}`}>
        <Button
          key="view"
          type="link"
          shape="circle"
          title={t('common.actions.view.title')}
          icon={<EyeOutlined />}
        />
      </Link>
    </Space>
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
      key: 'updatedAt',
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

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  return (
    <div className="FrameSimpleOrdersList" data-testid="FrameSimpleOrdersList">
      <Table
        size="middle"
        columns={columns}
        loading={dataLoaded === null}
        dataSource={data?.data as unknown as Order[] || []}
        pagination={false}
      />
    </div>
  )
}

export default FrameSimpleOrdersList
