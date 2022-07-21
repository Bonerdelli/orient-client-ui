import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space, Select } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { EyeOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { Order, OrderStatus } from 'orient-ui-library/library/models/order'

import OrderStatusTag from 'components/OrderStatusTag'
import { GridResponse } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { formatDate } from 'orient-ui-library/library/helpers/date'

import { getFrameOrdersList } from 'library/api/frameOrder'

import './FrameOrdersList.style.less'

const { Option } = Select

export enum FrameOrderStatusFilter {
  OperatorWaitForVerify = OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY,
  OperatorVerify = OrderStatus.FRAME_OPERATOR_VERIFYING,
  ClientRework = OrderStatus.FRAME_CLIENT_REWORK,
  ClientSign = OrderStatus.FRAME_CLIENT_SIGN,
  BankVerify = OrderStatus.FRAME_BANK_VERIFYING,
  HasOffer = OrderStatus.FRAME_HAS_OFFER,
  CustomerSign = OrderStatus.FRAME_CUSTOMER_SIGN,
  Completed = OrderStatus.FRAME_COMPLETED,
  OperatorReject = OrderStatus.FRAME_OPERATOR_REJECT,
  Cancel = OrderStatus.FRAME_CANCEL,
}

const statusFilterOptions = [
  FrameOrderStatusFilter.OperatorWaitForVerify,
  FrameOrderStatusFilter.OperatorVerify,
  FrameOrderStatusFilter.ClientRework,
  FrameOrderStatusFilter.ClientSign,
  FrameOrderStatusFilter.BankVerify,
  FrameOrderStatusFilter.HasOffer,
  FrameOrderStatusFilter.CustomerSign,
  FrameOrderStatusFilter.Completed,
  FrameOrderStatusFilter.OperatorReject,
  FrameOrderStatusFilter.Cancel,
]

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

  const [ selectedStatuses, setSelectedStatuses ] = useState<FrameOrderStatusFilter[]>([])

  useEffect(() => {
    console.log('selectedStatuses', selectedStatuses)
  }, [ selectedStatuses ])

  const filteredOptions = statusFilterOptions.filter(
    datum => !selectedStatuses.includes(datum)
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

  const renderStatus = (statusCode: OrderStatus, item: Order) => (
    <OrderStatusTag statusCode={statusCode} item={item} />
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
      title: t('common.dataEntity.actions'),
      align: 'center',
      width: 100,
    },
  ]

  const rowClassName = (record: Order) => (
    record.statusCode === OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY
      ? 'FrameOrdersList__row--new'
      : ''
  )

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  const selectedStatusTagRender = (props: CustomTagProps) => {
    const { value, closable, onClose } = props
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <OrderStatusTag
        statusCode={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="FrameOrdersList" data-testid="FrameOrdersList">
      <Select
        mode="tags"
        size="large"
        className="OrderList__filter"
        placeholder={t('common.filter.fieldPlaceholders.status')}
        tagRender={selectedStatusTagRender}
        value={selectedStatuses}
        defaultValue={[]}
        onChange={setSelectedStatuses}
        style={{ width: '100%' }}
      >
        {filteredOptions.map(item => (
          <Option key={item} value={item}>
            <OrderStatusTag statusCode={item as OrderStatus} />
          </Option>
        ))}
      </Select>
      <Table
        bordered
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

export default FrameOrdersList
