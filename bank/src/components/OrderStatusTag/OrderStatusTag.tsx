import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'

import { Order, OrderStatus } from 'orient-ui-library/library/models/order'

import './OrderStatusTag.style.less'

export interface OrderStatusTagProps {
  statusCode: OrderStatus,
  item?: Order,
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ statusCode }) => {
  const { t } = useTranslation()
  switch (statusCode) {
    case OrderStatus.FRAME_CUSTOMER_SIGN:
      return <Tag color="blue">{t('orderStatusTitles.customerSign')}</Tag>
    case OrderStatus.FRAME_COMPLETED:
      return <Tag>{t('orderStatusTitles.completed')}</Tag>
    case OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY:
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
    case OrderStatus.FRAME_CLIENT_SIGN:
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
    case OrderStatus.FRAME_CLIENT_REWORK:
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
    case OrderStatus.FRAME_HAS_OFFER:
    case OrderStatus.FRAME_CANCEL:
    case OrderStatus.FRAME_OPERATOR_REJECT:
    default:
      // NOTE: unknown statutes shouldn't be displayed
      return <></>
  }
}

export default OrderStatusTag
