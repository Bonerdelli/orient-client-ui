import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space, Select } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import type { BaseOptionType } from 'rc-select/lib/Select';
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

  const statusFilterOptions: BaseOptionType[] = [
    {
      label: t('orderStatusTitles.waitForVerify'),
      value: FrameOrderStatusFilter.OperatorWaitForVerify,
    },
    {
      label: t('orderStatusTitles.verifying'),
      value: FrameOrderStatusFilter.OperatorVerify,
    },
    {
      label: t('orderStatusTitles.needsForRework'),
      value: FrameOrderStatusFilter.ClientRework,
    },
    {
      label: t('orderStatusTitles.clientSign'),
      value: FrameOrderStatusFilter.ClientSign,
    },
    {
      label: t('orderStatusTitles.bankVerify'),
      value: FrameOrderStatusFilter.BankVerify,
    },
    {
      label: t('orderStatusTitles.hasOffer'),
      value: FrameOrderStatusFilter.HasOffer,
    },
    {
      label: t('orderStatusTitles.customerSign'),
      value: FrameOrderStatusFilter.CustomerSign,
    },
    {
      label: t('orderStatusTitles.completed'),
      value: FrameOrderStatusFilter.Completed,
    },
    {
      label: t('orderStatusTitles.operatorReject'),
      value: FrameOrderStatusFilter.OperatorReject,
    },
    {
      label: t('orderStatusTitles.cancel'),
      value: FrameOrderStatusFilter.Cancel,
    },
  ]

  const [ selectedStatuses, setSelectedStatuses ] = useState<BaseOptionType[]>([])
  const [ statusFilterAvailableOptions, setFilterAvailableOptions ] = useState<BaseOptionType[]>([])

  useEffect(() => {
    const filteredOptions = statusFilterOptions.filter(
      // datum => selectedStatuses.findIndex(selStatus => selStatus.value === datum.value)  // for labelInValue
      datum => !selectedStatuses.includes(datum.value)
    )
    setFilterAvailableOptions(filteredOptions)
    console.log('selectedStatuses', selectedStatuses)
  }, [ selectedStatuses ])

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

  const setSelectedStatusOptions = (options: BaseOptionType[]) => {
    const selected = options.filter(option =>
      statusFilterOptions.findIndex(filterOpt => filterOpt.value === option)
    !== -1)
    setSelectedStatuses(selected)
  }

  const statusOptionsFilter = (inputValue: string, option: BaseOptionType) =>
    (option?.label?.toLocaleString().toLowerCase().indexOf(inputValue.toLowerCase()) ?? true) !== -1

  return (
    <div className="FrameOrdersList" data-testid="FrameOrdersList">
      <Select
        mode="tags"
        className="OrderList__filter"
        style={{ width: '100%' }}
        placeholder={t('common.filter.fieldPlaceholders.status')}
        tagRender={selectedStatusTagRender}
        value={selectedStatuses}
        onChange={setSelectedStatusOptions}
        filterOption={statusOptionsFilter}
        labelInValue={false}
        size="middle"
        allowClear
      >
        {statusFilterAvailableOptions.map(item => (
          <Option key={item.value} value={item.value} label={item.label}>
            <OrderStatusTag statusCode={item.value as OrderStatus} />
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
