import { useTranslation } from 'react-i18next'
import { Link, useRouteMatch } from 'react-router-dom'

import { Table, Button, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { formatDate } from 'orient-ui-library/library/helpers/date'
import { Order, OrderStatus, OrderWizardType } from 'orient-ui-library/library/models/order'

import { GridResponse } from 'library/models'
import { useApi } from 'library/helpers/api' // TODO: to ui-lib

import { getCompanyOrdersList } from 'library/api'

import './OrdersList.style.less'

export interface OrdersListProps {
  companyId: number
}

const OrdersList: React.FC<OrdersListProps> = ({ companyId }) => {
  const { t } = useTranslation()
  const { url } = useRouteMatch()

  const [
    data,
    dataLoaded,
  ] = useApi<GridResponse<Order[]>>(
    getCompanyOrdersList,  // TODO: fixme
    { companyId },
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

  const renderStatus = (statusCode: OrderStatus, item: Order) => {
    switch (statusCode) {
      case OrderStatus.FRAME_DRAFT:
        return <Tag>{t('orderStatusTitles.draft')}</Tag>
      case OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY:
      case OrderStatus.FRAME_OPERATOR_VERIFYING:
        return <Tag color="blue">{t('orderStatusTitles.verifying')}</Tag>
      case OrderStatus.FRAME_CLIENT_REWORK:
        return <Tag color="green">{t('orderStatusTitles.needsForRework')}</Tag>
      case OrderStatus.FRAME_CLIENT_SIGN:
        return <Tag color="green">{t('orderStatusTitles.clientSign')}</Tag>
      case OrderStatus.FRAME_OPERATOR_VERIFYING:
        return <Tag color="blue">{t('orderStatusTitles.bankVerify')}</Tag>
      case OrderStatus.FRAME_HAS_OFFER:
        return <Tag color="green">{t('orderStatusTitles.hasOffer')}</Tag>
      case OrderStatus.FRAME_CUSTOMER_SIGN:
        return <Tag color="blue">{t('orderStatusTitles.customerSign')}</Tag>
      case OrderStatus.FRAME_COMPLETED:
        return <Tag color="blue">{t('orderStatusTitles.completed')}</Tag>
      case OrderStatus.FRAME_CANCEL:
        return <Tag>{t('orderStatusTitles.cancel')}</Tag>
      case OrderStatus.FRAME_OPERATOR_REJECT:
        return <Tag color="red">{t('orderStatusTitles.operatorReject')}</Tag>
      default:
        return <Tag>{item.statusName}</Tag>
    }
  }

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
    <div className="OrdersList" data-testid="OrdersList">
      <Table
        size="middle"
        columns={columns}
        loading={dataLoaded === null}
        dataSource={data?.data as unknown as Order[] || []}
        pagination={false}
        rowKey="id"
      />
    </div>
  )
}

export default OrdersList
