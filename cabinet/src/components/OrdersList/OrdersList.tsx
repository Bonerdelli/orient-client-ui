import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space, Tag, TagProps, Select } from 'antd'
import { ReloadOutlined, ClearOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'
import type { BaseOptionType } from 'rc-select/lib/Select'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { formatDate } from 'orient-ui-library/library/helpers/date'
import { Order, OrderStatus, OrderWizardType } from 'orient-ui-library/library/models/order'
import { FactoringStatus } from 'orient-ui-library/library/models/order'
import { formatCurrency } from 'orient-ui-library/library/helpers/numerics'

import { CabinetMode } from 'library/models/cabinet'
import { getCompanyOrdersList } from 'library/api'
import { GridResponse } from 'library/models' // TODO: to ui-lib

import OrderStatusTag from 'components/OrderStatusTag'

import portalConfig from 'config/portal.yaml'
import './OrdersList.style.less'

const { Option } = Select

export interface OrdersListProps {
  companyId: number
  mode?: CabinetMode
}

export enum StatusFilter {
  Drafts, // NOTE: disabled for Customer
  SignRequired,
  Verifying,
  WaitForCharge,
  Charged,
  Completed,
  Cancelled,
}

const ClientStatusFilterValues = {
  [StatusFilter.Drafts]: [
    FactoringStatus.FACTOR_CLIENT_REWORK,
    FactoringStatus.FACTOR_DRAFT,
    OrderStatus.FRAME_CLIENT_REWORK,
    OrderStatus.FRAME_DRAFT,
  ],
  [StatusFilter.Verifying]: [
    FactoringStatus.FACTOR_OPERATOR_VERIFY,
    FactoringStatus.FACTOR_OPERATOR_WAIT_FOR_VERIFY,
    OrderStatus.FRAME_BANK_VERIFYING,
    OrderStatus.FRAME_OPERATOR_VERIFYING,
    OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY,
  ],
  [StatusFilter.SignRequired]: [
    FactoringStatus.FACTOR_CLIENT_SIGN,
    OrderStatus.FRAME_CLIENT_SIGN,
    OrderStatus.FRAME_HAS_OFFER,
  ],
  [StatusFilter.WaitForCharge]: [
    FactoringStatus.FACTOR_WAIT_FOR_CHARGE,
  ],
  [StatusFilter.Charged]: [
    FactoringStatus.FACTOR_CHARGED,
  ],
  [StatusFilter.Completed]: [
    FactoringStatus.FACTOR_CHARGED,
    OrderStatus.FRAME_COMPLETED,
  ],
  [StatusFilter.Cancelled]: [
    FactoringStatus.FACTOR_BANK_REJECT,
    FactoringStatus.FACTOR_CANCEL,
    FactoringStatus.FACTOR_OPERATOR_REJECT,
    OrderStatus.FRAME_BANK_REJECT,
    OrderStatus.FRAME_CANCEL,
    OrderStatus.FRAME_OPERATOR_REJECT,
  ],
}

const CustomerStatusFilterValues = {
  [StatusFilter.SignRequired]: [
    FactoringStatus.FACTOR_BANK_REJECT,
    FactoringStatus.FACTOR_BANK_SIGN,
    FactoringStatus.FACTOR_CHARGED,
    FactoringStatus.FACTOR_COMPLETED,
    FactoringStatus.FACTOR_CUSTOMER_SIGN,
    FactoringStatus.FACTOR_WAIT_FOR_CHARGE,
    OrderStatus.FRAME_COMPLETED,
    OrderStatus.FRAME_CUSTOMER_SIGN,
  ],
  [StatusFilter.Verifying]: [
    FactoringStatus.FACTOR_BANK_SIGN,
  ],
  [StatusFilter.WaitForCharge]: [
    FactoringStatus.FACTOR_WAIT_FOR_CHARGE,
  ],
  [StatusFilter.Charged]: [
    FactoringStatus.FACTOR_CHARGED,
  ],
  [StatusFilter.Completed]: [
    OrderStatus.FRAME_COMPLETED,
    FactoringStatus.FACTOR_COMPLETED,
  ],
  [StatusFilter.Cancelled]: [
    FactoringStatus.FACTOR_BANK_REJECT,
  ],
}

const defaultStatusFilter: StatusFilter[] = []

const OrdersList: React.FC<OrdersListProps> = ({
  companyId,
  mode = CabinetMode.Client,
}) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [ page, setPage ] = useState<number>(1)
  const [ onPage, setOnPage ] = useState<number>(portalConfig.dataDisplay.listItemsOnPage)
  const [ itemsTotal, setItemsTotal ] = useState<number>()
  const [ listData, setListData ] = useState<Order[]>()
  const [ loaded, setLoaded ] = useState<boolean | null>(null)

  const [ selectedStatuses, setSelectedStatuses ] = useState<StatusFilter[]>(defaultStatusFilter)
  const [ statusFilterAvailableOptions, setFilterAvailableOptions ] = useState<BaseOptionType[]>([])

  useEffect(() => {
    setLoaded(null)
    loadData()
  }, [ page, onPage, selectedStatuses ])

  const loadData = async () => {
    const statuses = selectedStatuses
      .flatMap(status =>
        mode === CabinetMode.Customer
          ? CustomerStatusFilterValues[status]
          : ClientStatusFilterValues[status]
      )
    const request = {
      statuses,
      limit: onPage,
      page,
    }
    const result = await getCompanyOrdersList({
      companyId,
      mode,
    }, request)
    if (result && result.success) {
      setItemsTotal((result.data as unknown as GridResponse).total)
      setListData((result.data as unknown as GridResponse<Order>).data)
      setLoaded(true)
    } else {
      setLoaded(false)
    }
  }

  const statusFilterOptions: BaseOptionType[] = [
    {
      label: t('offerFilterLabels.drafts'),
      value: StatusFilter.Drafts,
    },
    {
      label: t('offerFilterLabels.signRequired'),
      value: StatusFilter.SignRequired,
    },
    {
      label: t('offerFilterLabels.verifying'),
      value: StatusFilter.Verifying,
    },
    {
      label: t('offerFilterLabels.waitForCharge'),
      value: StatusFilter.WaitForCharge,
    },
    {
      label: t('offerFilterLabels.charged'),
      value: StatusFilter.Charged,
    },
    {
      label: t('offerFilterLabels.completed'),
      value: StatusFilter.Completed,
    },
    {
      label: t('offerFilterLabels.cancelled'),
      value: StatusFilter.Cancelled,
    },
  ]

  useEffect(() => {
    const filteredOptions = statusFilterOptions
      .filter(
        datum => (mode === CabinetMode.Client || datum.value !== StatusFilter.Drafts)
      )
      .filter(
        datum => !selectedStatuses.includes(datum.value)
      )
    setFilterAvailableOptions(filteredOptions)
    setPage(1)
  }, [ selectedStatuses ])

  const clearFilter = () => {
    setSelectedStatuses([])
    setPage(1)
  }

  const setSelectedStatusOptions = (options: StatusFilter[]) => {
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
        tagRender={({ value, ...props }) => renderStatusFilterTag(value, props)}
        value={selectedStatuses}
        onChange={setSelectedStatusOptions}
        filterOption={statusOptionsFilter}
        labelInValue={false}
        allowClear={false}
        size="middle"
      >
        {statusFilterAvailableOptions.map(item => (
          <Option key={item.value} value={item.value} label={item.label}>
            {renderStatusFilterTag(item.value)}
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

  const renderActions = (_val: unknown, item: Order) => {
    let path
    switch (item.typeCode) {
      case OrderWizardType.Frame:
        path = 'frame'
        break;
      case OrderWizardType.FrameSimple:
        path = 'frame-simple'
        break;
      case OrderWizardType.Factoring:
        path = 'factoring'
        break;
      default:
        break;
    }
    return (
      <Space size="small">
        <Link to={`${url}/${path}/${item.id}`}>
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
  }

  const renderOrderType = (code: OrderWizardType) => {
    switch (code) {
      case OrderWizardType.Frame:
        return t('models.order.types.frameOrder.titleShort')
      case OrderWizardType.FrameSimple:
        return t('models.order.types.frameSimpleOrder.titleShort')
      case OrderWizardType.Factoring:
        return t('models.order.types.factoring.titleShort')
      default:
        return <></>
    }
  }

  const renderStatusFilterTag = (value: StatusFilter, props?: TagProps) => {
    switch (value) {
      case StatusFilter.Drafts:
        return <Tag {...props}>{t('offerFilterLabels.drafts')}</Tag>
      case StatusFilter.SignRequired:
        return <Tag color="green" {...props}>{t('offerFilterLabels.signRequired')}</Tag>
      case StatusFilter.Verifying:
        return <Tag color="blue" {...props}>{t('offerFilterLabels.verifying')}</Tag>
      case StatusFilter.WaitForCharge:
        return <Tag color="blue" {...props}>{t('offerFilterLabels.waitForCharge')}</Tag>
      case StatusFilter.Charged:
        return <Tag color="blue" {...props}>{t('offerFilterLabels.charged')}</Tag>
      case StatusFilter.Completed:
        return <Tag color="blue" {...props}>{t('offerFilterLabels.completed')}</Tag>
      case StatusFilter.Cancelled:
        return <Tag color="red" {...props}>{t('offerFilterLabels.cancelled')}</Tag>
      default:
        return <></>
    }
  }

  const renderStatus = (statusCode: OrderStatus) => (
    <OrderStatusTag statusCode={statusCode} />
  )

  const rowClassName = (item: Order) => (
    mode === CabinetMode.Customer
      && (item.statusCode === OrderStatus.FRAME_CUSTOMER_SIGN
        || item.statusCode === FactoringStatus.FACTOR_CUSTOMER_SIGN)
        ? 'OrdersList__row--new'
        : ''
  )

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
      render: (val, item) => val ? formatCurrency(val, {
        currency: item.currencyCode || undefined,
      }) : '',
      align: 'right',
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
      title: t('common.dataEntity.actions'),
      align: 'center',
      width: 100,
    },
  ]

  if (loaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  return (
    <div className="OrdersList" data-testid="OrdersList">
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
    </div>
  )
}

export default OrdersList
