import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { formatDate } from 'orient-ui-library/library/helpers/date'
import { Order, OrderStatus, OrderWizardType } from 'orient-ui-library/library/models/order'
import { FactoringStatus } from 'orient-ui-library/library/models/order'
import { formatCurrency } from 'orient-ui-library/library/helpers/numerics'

import { CabinetMode } from 'library/models/cabinet'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompanyOrdersList } from 'library/api'
import { GridResponse } from 'library/models' // TODO: to ui-lib

import OrderStatusTag from 'components/OrderStatusTag'

import './OrdersList.style.less'

export interface OrdersListProps {
  companyId: number
  mode?: CabinetMode
}

export enum ClientStatusFilter {
  Drafts,
  Verifying,
  SignRequired,
  WaitForCharge,
  Charged,
  Completed,
  Cancelled,
}

export enum CustomerStatusFilter {
  SignRequired,
  Verifying,
  WaitForCharge,
  Charged,
  Completed,
  Cancelled,
}

const ClientStatusFilterValues = {
  [ClientStatusFilter.Drafts]: [
    FactoringStatus.FACTOR_CLIENT_REWORK,
    FactoringStatus.FACTOR_DRAFT,
    OrderStatus.FRAME_CLIENT_REWORK,
    OrderStatus.FRAME_DRAFT,
  ],
  [ClientStatusFilter.Verifying]: [
    FactoringStatus.FACTOR_OPERATOR_VERIFY,
    FactoringStatus.FACTOR_OPERATOR_WAIT_FOR_VERIFY,
    OrderStatus.FRAME_BANK_VERIFYING,
    OrderStatus.FRAME_OPERATOR_VERIFYING,
    OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY,
  ],
  [ClientStatusFilter.SignRequired]: [
    FactoringStatus.FACTOR_CLIENT_SIGN,
    OrderStatus.FRAME_CLIENT_SIGN,
    OrderStatus.FRAME_HAS_OFFER,
  ],
  [ClientStatusFilter.WaitForCharge]: [
    FactoringStatus.FACTOR_WAIT_FOR_CHARGE,
  ],
  [ClientStatusFilter.Charged]: [
    FactoringStatus.FACTOR_CHARGED,
  ],
  [ClientStatusFilter.Completed]: [
    FactoringStatus.FACTOR_CHARGED,
    OrderStatus.FRAME_COMPLETED,
  ],
  [ClientStatusFilter.Cancelled]: [
    FactoringStatus.FACTOR_BANK_REJECT,
    FactoringStatus.FACTOR_CANCEL,
    FactoringStatus.FACTOR_OPERATOR_REJECT,
    OrderStatus.FRAME_BANK_REJECT,
    OrderStatus.FRAME_CANCEL,
    OrderStatus.FRAME_OPERATOR_REJECT,
  ],
}


const CustomerStatusFilterValues = {
  [ClientStatusFilter.SignRequired]: [
    FactoringStatus.FACTOR_BANK_REJECT,
    FactoringStatus.FACTOR_BANK_SIGN,
    FactoringStatus.FACTOR_CHARGED,
    FactoringStatus.FACTOR_COMPLETED,
    FactoringStatus.FACTOR_CUSTOMER_SIGN,
    FactoringStatus.FACTOR_WAIT_FOR_CHARGE,
    OrderStatus.FRAME_COMPLETED,
    OrderStatus.FRAME_CUSTOMER_SIGN,
  ],
  [ClientStatusFilter.Verifying]: [
    FactoringStatus.FACTOR_BANK_SIGN,
  ],
  [ClientStatusFilter.WaitForCharge]: [
    FactoringStatus.FACTOR_WAIT_FOR_CHARGE,
  ],
  [ClientStatusFilter.Charged]: [
    FactoringStatus.FACTOR_CHARGED,
  ],
  [ClientStatusFilter.Completed]: [
    OrderStatus.FRAME_COMPLETED,
    FactoringStatus.FACTOR_COMPLETED,
  ],
  [ClientStatusFilter.Cancelled]: [
    FactoringStatus.FACTOR_BANK_REJECT,
  ],
}

const OrdersList: React.FC<OrdersListProps> = ({ companyId, mode }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [
    data,
    dataLoaded,
  ] = useApi<GridResponse<Order[]>>(
    getCompanyOrdersList, {
      mode,
      companyId,
    },
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

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

  return (
    <div className="OrdersList" data-testid="OrdersList">
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

export default OrdersList
