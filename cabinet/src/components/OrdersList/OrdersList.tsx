import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { formatDate } from 'orient-ui-library/library/helpers/date'
import { FrameOrderStatus } from 'orient-ui-library/library/models/order'

import { Order, GridResponse } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib

import { getCompanyOrdersList } from 'library/api'

import './OrdersList.style.less'

export interface OrdersListProps {
  companyId: number
}

const OrdersList: React.FC<OrdersListProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [
    data,
    dataLoaded,
  ] = useApi<GridResponse<Order[]>>(
    getCompanyOrdersList,  // TODO: fixme
    { companyId },
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

  const renderOrderType = (code: string) => {
    switch (code) {
      // TODO: fill me with other params
      case 'frame':
        return 'На рамочный договор' // TODO: ask be for enum and add l10ns
      default:
        return <></>
    }
  }


  const renderStatus = (statusCode: FrameOrderStatus) => {
    switch (statusCode) {
      case FrameOrderStatus.FRAME_DRAFT:
        return <Tag>{t('orderStatusTitles.draft')}</Tag>
      case FrameOrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY:
      case FrameOrderStatus.FRAME_OPERATOR_VERIFY:
        return <Tag color="blue">{t('orderStatusTitles.verifying')}</Tag>
      case FrameOrderStatus.FRAME_CLIENT_REWORK:
        return <Tag color="green">{t('orderStatusTitles.needsForRework')}</Tag>
      case FrameOrderStatus.FRAME_CLIENT_SIGN:
      case FrameOrderStatus.FRAME_BANK_VERIFY:
      case FrameOrderStatus.FRAME_HAS_OFFER:
      case FrameOrderStatus.FRAME_CUSTOMER_SIGN:
      case FrameOrderStatus.FRAME_COMPLETED:
      case FrameOrderStatus.FRAME_CANCEL:
      case FrameOrderStatus.FRAME_OPERATOR_REJECT:
      default:
        return <></>
    }
  }

  const columns: ColumnsType<Order> = [
    {
      key: 'number',
      dataIndex: 'id',
      title: t('models.order.fields.id.title'), // TODO: choose where to store such l10ns
      align: 'center',
    },
    {
      key: 'typeCode',
      dataIndex: 'typeCode',
      title: t('models.order.fields.typeCode.title'),
      render: renderOrderType,
      align: 'left',
    },
    {
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      title: t('models.order.fields.createdAt.title'), // TODO: fixme
      render: (val) => formatDate(val, { includeTime: true }),
      align: 'center',
    },
    {
      key: 'amount',
      dataIndex: 'amount',
      title: t('models.order.fields.amount.title'),
    },
    {
      key: 'statusCode',
      dataIndex: 'statusCode',
      title: t('models.order.fields.statusName.title'),
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
    <div className="OrdersList" data-testid="OrdersList">
      <Table
        size="middle"
        columns={columns}
        loading={dataLoaded === null}
        dataSource={data?.data as unknown as Order[] || []}
        pagination={false}
        rowKey="id"
      />
    </div>
  )
}

export default OrdersList
