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
