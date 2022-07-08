import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { Order } from 'orient-ui-library/library/models/order'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { formatDate } from 'orient-ui-library/library/helpers/date'

import OfferStatusTag from 'components/OfferStatusTag'
import { GridResponse } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib

import { getFrameOrdersList } from 'library/api/frameOrder'

import './FrameOrdersList.style.less'

export interface FrameOrdersListProps {
  bankId: number | bigint
}

const FrameOrdersList: React.FC<FrameOrdersListProps> = ({ bankId }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [
    data,
    dataLoaded,
  ] = useApi<GridResponse<Order[]>>(
    getFrameOrdersList, {
      bankId,
    },
  )

  const renderStatus = (statusCode: BankOfferStatus) => (
    <OfferStatusTag statusCode={statusCode} />
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

  const rowClassName = (item: any) => ( // TODO: fixme
    item.statusCode as BankOfferStatus === BankOfferStatus.BankWaitForVerify
      ? 'FrameOrdersList__row--new'
      : ''
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
        rowClassName={rowClassName}
        dataSource={data?.data as unknown as Order[] || []}
        pagination={false}
        rowKey="id"
      />
    </div>
  )
}

export default FrameOrdersList
