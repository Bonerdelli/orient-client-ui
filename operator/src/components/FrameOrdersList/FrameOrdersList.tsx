import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { Order, FrameOrderStatus } from 'orient-ui-library/library/models/order'

import { GridResponse } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { formatDate } from 'orient-ui-library/library/helpers/date'

import { getFrameOrdersList } from 'library/api/frameOrder'

import './FrameOrdersList.style.less'

export interface FrameOrdersListProps {

}

const FrameOrdersList: React.FC<FrameOrdersListProps> = ({}) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [
    data,
    dataLoaded,
  ] = useApi<GridResponse<Order[]>>(
    getFrameOrdersList, {},
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

  const renderStatus = (statusCode: FrameOrderStatus, item: Order) => {
    switch (statusCode) {
      case FrameOrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY:
        return <Tag color="green">{t('orderStatusTitles.waitForVerify')}</Tag>
      case FrameOrderStatus.FRAME_OPERATOR_VERIFY:
        return <Tag color="green">{t('orderStatusTitles.verifying')}</Tag>
      case FrameOrderStatus.FRAME_CLIENT_SIGN:
        return <Tag color="blue">{t('orderStatusTitles.clientSign')}</Tag>
      case FrameOrderStatus.FRAME_BANK_VERIFY:
        return <Tag color="blue">{t('orderStatusTitles.bankVerify')}</Tag>

      case FrameOrderStatus.FRAME_CLIENT_REWORK:
      case FrameOrderStatus.FRAME_BANK_VERIFY:
      case FrameOrderStatus.FRAME_HAS_OFFER:
      case FrameOrderStatus.FRAME_CUSTOMER_SIGN:
      case FrameOrderStatus.FRAME_COMPLETED:
      case FrameOrderStatus.FRAME_CANCEL:
      case FrameOrderStatus.FRAME_OPERATOR_REJECT:
      default:
        return <Tag>{item.statusName}</Tag>
    }
  }

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

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  return (
    <div className="FrameOrdersList" data-testid="FrameOrdersList">
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

export default FrameOrdersList
