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
import { FactoringStatus, Order, OrderStatus } from 'orient-ui-library/library/models/order'

import OrderStatusTag from 'components/OrderStatusTag'
import { GridResponse } from 'library/models'

import { formatDate } from 'orient-ui-library/library/helpers/date'
import { formatCurrency } from 'orient-ui-library/library/helpers/numerics'

import { getFactoringOrdersList } from 'library/api/factoring'

import portalConfig from 'config/portal.yaml'
import './FactoringOrdersList.style.less'

const { Option } = Select

export enum FactoringStatusFilter {
  OperatorWaitForVerify = FactoringStatus.FACTOR_OPERATOR_WAIT_FOR_VERIFY,
  OperatorVerify = FactoringStatus.FACTOR_OPERATOR_VERIFY,
  ClientRework = FactoringStatus.FACTOR_CLIENT_REWORK,
  ClientSign = FactoringStatus.FACTOR_CLIENT_SIGN,
  CustomerSign = FactoringStatus.FACTOR_CUSTOMER_SIGN,
  BankSign = FactoringStatus.FACTOR_BANK_SIGN,
  WaitForCharge = FactoringStatus.FACTOR_WAIT_FOR_CHARGE,
  Charged = FactoringStatus.FACTOR_CHARGED,
  Completed = FactoringStatus.FACTOR_COMPLETED,
  OperatorReject = FactoringStatus.FACTOR_OPERATOR_REJECT,
  Cancel = FactoringStatus.FACTOR_CANCEL,
  BankReject = FactoringStatus.FACTOR_BANK_REJECT,
}

const defaultStatusFilter = [
  FactoringStatusFilter.OperatorWaitForVerify
]

const FactoringOrdersList: React.FC = () => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [ page, setPage ] = useState<number>(1)
  const [ onPage, setOnPage ] = useState<number>(portalConfig.dataDisplay.listItemsOnPage)
  const [ itemsTotal, setItemsTotal ] = useState<number>()
  const [ listData, setListData ] = useState<Order[]>()
  const [ loaded, setLoaded ] = useState<boolean | null>(null)

  const [ selectedStatuses, setSelectedStatuses ] = useState<FactoringStatusFilter[]>(defaultStatusFilter)
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
    const result = await getFactoringOrdersList(null, request)
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
      label: t('orderStatusTitles.operatorWaitForVerify'),
      value: FactoringStatusFilter.OperatorWaitForVerify,
    },
    {
      label: t('orderStatusTitles.operatorVerify'),
      value: FactoringStatusFilter.OperatorVerify,
    },
    {
      label: t('orderStatusTitles.clientRework'),
      value: FactoringStatusFilter.ClientRework,
    },
    {
      label: t('orderStatusTitles.clientSign'),
      value: FactoringStatusFilter.ClientSign,
    },
    {
      label: t('orderStatusTitles.customerSign'),
      value: FactoringStatusFilter.CustomerSign,
    },
    {
      label: t('orderStatusTitles.bankSign'),
      value: FactoringStatusFilter.BankSign,
    },
    {
      label: t('orderStatusTitles.waitForCharge'),
      value: FactoringStatusFilter.WaitForCharge,
    },
    {
      label: t('orderStatusTitles.charged'),
      value: FactoringStatusFilter.Charged,
    },
    {
      label: t('orderStatusTitles.completed'),
      value: FactoringStatusFilter.Completed,
    },
    {
      label: t('orderStatusTitles.operatorReject'),
      value: FactoringStatusFilter.OperatorReject,
    },
    {
      label: t('orderStatusTitles.cancel'),
      value: FactoringStatusFilter.Cancel,
    },
    {
      label: t('orderStatusTitles.bankReject'),
      value: FactoringStatusFilter.BankReject,
    },
  ]

  useEffect(() => {
    const filteredOptions = statusFilterOptions.filter(
      // datum => selectedStatuses.findIndex(selStatus => selStatus.value === datum.value)  // for labelInValue
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

  const renderStatus = (statusCode: OrderStatus, item: Order) => (
    <OrderStatusTag statusCode={statusCode} item={item} />
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
      key: 'amount',
      dataIndex: 'amount',
      title: t('frameOrdersPage.tableColumnTitles.amount'),
      render: (val, item) => val ? formatCurrency(val, {
        currency: item.currencyCode || undefined,
      }) : '',
      align: 'right',
    },
    {
      key: 'days',
      dataIndex: 'days',
      title: t('frameOrdersPage.tableColumnTitles.days'),
      align: 'center',
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
    record.statusCode === FactoringStatus.FACTOR_OPERATOR_WAIT_FOR_VERIFY
      ? 'FactoringOrdersList__row--new'
      : ''
  )

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

  const setSelectedStatusOptions = (options: FactoringStatusFilter[]) => {
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
            <OrderStatusTag statusCode={item.value as OrderStatus} />
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
    <Div className="FactoringOrdersList" data-testid="FactoringOrdersList">
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

export default FactoringOrdersList
