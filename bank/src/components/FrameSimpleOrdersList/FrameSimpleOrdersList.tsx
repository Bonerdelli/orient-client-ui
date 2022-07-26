import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space, Select } from 'antd'
import { ReloadOutlined, ClearOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/lib/table'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import type { BaseOptionType } from 'rc-select/lib/Select';
import { EyeOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { Order, OrderStatus } from 'orient-ui-library/library/models/order'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import OfferStatusTag from 'components/OfferStatusTag'
import { GridResponse } from 'library/models'
import { formatDate } from 'orient-ui-library/library/helpers/date'

import { getFrameSimpleOrdersList } from 'library/api/frameSimpleOrder'

import portalConfig from 'config/portal.yaml'
import './FrameSimpleOrdersList.style.less'

const { Option } = Select

export enum FrameSimpleOrderStatusFilter {
  OperatorWaitForVerify = OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY,
  OperatorVerify = OrderStatus.FRAME_OPERATOR_VERIFYING,
  ClientRework = OrderStatus.FRAME_CLIENT_REWORK,
  ClientSign = OrderStatus.FRAME_CLIENT_SIGN,
  BankVerify = OrderStatus.FRAME_BANK_VERIFYING,
  HasOffer = OrderStatus.FRAME_HAS_OFFER,
  CustomerSign = OrderStatus.FRAME_CUSTOMER_SIGN,
  Completed = OrderStatus.FRAME_COMPLETED,
  OperatorReject = OrderStatus.FRAME_OPERATOR_REJECT,
  BankReject = OrderStatus.FRAME_BANK_REJECT,
  Cancel = OrderStatus.FRAME_CANCEL,
}

const defaultStatusFilter = [
  FrameSimpleOrderStatusFilter.OperatorWaitForVerify
]

export interface FrameSimpleOrdersListProps {
  bankId: number | bigint
}

const FrameSimpleOrdersList: React.FC<FrameSimpleOrdersListProps> = ({ bankId }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [ page, setPage ] = useState<number>(1)
  const [ onPage, setOnPage ] = useState<number>(portalConfig.dataDisplay.listItemsOnPage)
  const [ itemsTotal, setItemsTotal ] = useState<number>()
  const [ listData, setListData ] = useState<Order[]>()
  const [ loaded, setLoaded ] = useState<boolean | null>(null)

  const [ selectedStatuses, setSelectedStatuses ] = useState<FrameSimpleOrderStatusFilter[]>(defaultStatusFilter)
  const [ statusFilterAvailableOptions, setFilterAvailableOptions ] = useState<BaseOptionType[]>([])

  useEffect(() => {
    setLoaded(null)
    loadData()
  }, [ page, onPage, selectedStatuses ])

  const loadData = async () => {
    const request = {
      statuses: selectedStatuses,
      limit: onPage,
      page,
    }
    const result = await getFrameSimpleOrdersList({
      bankId: bankId as number,
    }, request)
    if (result && result.success) {
      setItemsTotal((result.data as unknown as GridResponse).total)
      setListData((result.data as unknown as GridResponse<Order>).data)
      setLoaded(true)
    } else {
      setLoaded(false)
    }
  }

  const clearFilter = () => {
    setSelectedStatuses([])
    setPage(1)
  }

  const statusFilterOptions: BaseOptionType[] = [
    {
      label: t('orderStatusTitles.waitForVerify'),
      value: FrameSimpleOrderStatusFilter.OperatorWaitForVerify,
    },
    {
      label: t('orderStatusTitles.verifying'),
      value: FrameSimpleOrderStatusFilter.OperatorVerify,
    },
    {
      label: t('orderStatusTitles.needsForRework'),
      value: FrameSimpleOrderStatusFilter.ClientRework,
    },
    {
      label: t('orderStatusTitles.clientSign'),
      value: FrameSimpleOrderStatusFilter.ClientSign,
    },
    {
      label: t('orderStatusTitles.bankVerify'),
      value: FrameSimpleOrderStatusFilter.BankVerify,
    },
    {
      label: t('orderStatusTitles.hasOffer'),
      value: FrameSimpleOrderStatusFilter.HasOffer,
    },
    {
      label: t('orderStatusTitles.customerSign'),
      value: FrameSimpleOrderStatusFilter.CustomerSign,
    },
    {
      label: t('orderStatusTitles.completed'),
      value: FrameSimpleOrderStatusFilter.Completed,
    },
    {
      label: t('orderStatusTitles.operatorReject'),
      value: FrameSimpleOrderStatusFilter.OperatorReject,
    },
    {
      label: t('orderStatusTitles.bankReject'),
      value: FrameSimpleOrderStatusFilter.BankReject,
    },
    {
      label: t('orderStatusTitles.cancel'),
      value: FrameSimpleOrderStatusFilter.Cancel,
    },
  ]

  useEffect(() => {
    const filteredOptions = statusFilterOptions.filter(
      datum => !selectedStatuses.includes(datum.value)
    )
    setFilterAvailableOptions(filteredOptions)
    setPage(1)
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

  const renderStatus = (statusCode: BankOfferStatus) => (
    <OfferStatusTag statusCode={statusCode} />
  )

  const rowClassName = (record: Order) => (
    record.statusCode === OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY
      ? 'FrameSimpleOrdersList__row--new'
      : ''
  )

  if (loaded === false) {
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
      <OfferStatusTag
        statusCode={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
      />
    )
  }

  const setSelectedStatusOptions = (options: FrameSimpleOrderStatusFilter[]) => {
    const selected = options.filter(option =>
      statusFilterOptions.findIndex(filterOpt => filterOpt.value === option)
    !== -1)
    setSelectedStatuses(selected)
  }

  const statusOptionsFilter = (inputValue: string, option: BaseOptionType) =>
    (option?.label?.toLocaleString().toLowerCase().indexOf(inputValue.toLowerCase()) ?? true) !== -1

  const renderFilters = () => (
    <Div className="OrderList__filter">
      <Select
        mode="tags"
        className="OrderList__filter__item--grow"
        placeholder={t('common.filter.fieldPlaceholders.status')}
        tagRender={selectedStatusTagRender}
        value={selectedStatuses}
        onChange={setSelectedStatusOptions}
        filterOption={statusOptionsFilter}
        labelInValue={false}
        allowClear={false}
        size="middle"
      >
        {statusFilterAvailableOptions.map(item => (
          <Option key={item.value} value={item.value} label={item.label}>
            <OfferStatusTag statusCode={item.value as OrderStatus} />
          </Option>
        ))}
      </Select>
      <Button
        size="large"
        type="link"
        className="OrderList__filter__action"
        icon={<ClearOutlined />}
        disabled={!selectedStatuses.length}
        onClick={clearFilter}
      >
        {t('common.filter.actionTitles.clear')}
      </Button>
      <Button
        size="large"
        type="link"
        className="OrderList__filter__action"
        icon={<ReloadOutlined />}
        onClick={() => {
          setLoaded(null)
          loadData()
        }}
      >
        {t('common.actions.refresh.title')}
      </Button>
    </Div>
  )

  return (
    <Div className="FrameSimpleOrdersList" data-testid="FrameSimpleOrdersList">
      {renderFilters()}
      <Table
        bordered
        size="middle"
        columns={columns}
        loading={loaded === null}
        dataSource={listData ?? []}
        rowClassName={rowClassName}
        pagination={{
          size: "default",
          current: page,
          pageSize: onPage,
          total: itemsTotal,
          showSizeChanger: false,
          hideOnSinglePage: true,
          onChange: (current, size) => {
            setPage(current)
            setOnPage(size)
          }
        }}
        rowKey="id"
      />
    </Div>
  )
}

export default FrameSimpleOrdersList
