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
import { Order } from 'orient-ui-library/library/models/order'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import OfferStatusTag from 'components/OfferStatusTag'
import { GridResponse } from 'library/models'
import { formatDate } from 'orient-ui-library/library/helpers/date'

import { getFrameOrdersList } from 'library/api/frameOrder'

import portalConfig from 'config/portal.yaml'
import './FrameOrdersList.style.less'

const { Option } = Select

export enum FrameSimpleOrderStatusFilter {
  BankWaitForVerify = BankOfferStatus.BankWaitForVerify, // Ожидает проверки банком
  BankVerify = BankOfferStatus.BankVerify, // Проверка банком
  ClientRework = BankOfferStatus.ClientRework, // Доработка
  BankOffer = BankOfferStatus.BankOffer, // Формирование предложения
  BankSign = BankOfferStatus.BankSign, // Требует подписи банка
  BankOfferSent = BankOfferStatus.BankOfferSent, // Предложение отправлено
  CustomerSign = BankOfferStatus.CustomerSign, // Требует подписи заказчика
  Completed = BankOfferStatus.Completed, // Договор заключен
  BankReject = BankOfferStatus.BankReject, // Отказ банка
  ClientOfferReject = BankOfferStatus.ClientOfferReject, // Отказ от предложения
}

const defaultStatusFilter = [
  FrameSimpleOrderStatusFilter.BankSign
]

export interface FrameOrdersListProps {
  bankId: number | bigint
}

const FrameOrdersList: React.FC<FrameOrdersListProps> = ({ bankId }) => {
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
    const result = await getFrameOrdersList({
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
      label: t('offerStatusTitles.bankWaitForVerify'),
      value: FrameSimpleOrderStatusFilter.BankWaitForVerify,
    },
    {
      label: t('offerStatusTitles.bankVerify'),
      value: FrameSimpleOrderStatusFilter.BankVerify,
    },
    {
      label: t('offerStatusTitles.clientRework'),
      value: FrameSimpleOrderStatusFilter.ClientRework,
    },
    {
      label: t('offerStatusTitles.bankOffer'),
      value: FrameSimpleOrderStatusFilter.BankOffer,
    },
    {
      label: t('offerStatusTitles.bankSign'),
      value: FrameSimpleOrderStatusFilter.BankSign,
    },
    {
      label: t('offerStatusTitles.bankOfferSent'),
      value: FrameSimpleOrderStatusFilter.BankOfferSent,
    },
    {
      label: t('offerStatusTitles.customerSign'),
      value: FrameSimpleOrderStatusFilter.CustomerSign,
    },
    {
      label: t('offerStatusTitles.completed'),
      value: FrameSimpleOrderStatusFilter.Completed,
    },
    {
      label: t('offerStatusTitles.bankReject'),
      value: FrameSimpleOrderStatusFilter.BankReject,
    },
    {
      label: t('offerStatusTitles.clientOfferReject'),
      value: FrameSimpleOrderStatusFilter.ClientOfferReject,
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

  const rowClassName = (item: Order) => (
    item.statusCode as BankOfferStatus === BankOfferStatus.BankWaitForVerify
      ? 'FrameOrdersList__row--new'
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
        dropdownClassName="OrderList__filter__combobox__options"
        className="OrderList__filter__combobox OrderList__filter__item--grow"
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
            <OfferStatusTag statusCode={item.value as BankOfferStatus} />
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
    <Div className="FrameOrdersList" data-testid="FrameOrdersList">
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

export default FrameOrdersList
