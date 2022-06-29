import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'

import { Order, OrderStatus } from 'orient-ui-library/library/models/order'

import './OrderStatusTag.style.less'

export interface OrderStatusTagProps {
  statusCode: OrderStatus,
  item?: Order,
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ statusCode, item }) => {
  const { t } = useTranslation()
  switch (statusCode) {
    case OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY:
      return <Tag color="green">{t('orderStatusTitles.waitForVerify')}</Tag>
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
      return <Tag color="green">{t('orderStatusTitles.verifying')}</Tag>
    case OrderStatus.FRAME_CLIENT_SIGN:
      return <Tag color="blue">{t('orderStatusTitles.clientSign')}</Tag>
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
      return <Tag color="blue">{t('orderStatusTitles.bankVerify')}</Tag>

    case OrderStatus.FRAME_CLIENT_REWORK:
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
    case OrderStatus.FRAME_HAS_OFFER:
    case OrderStatus.FRAME_CUSTOMER_SIGN:
    case OrderStatus.FRAME_COMPLETED:
    case OrderStatus.FRAME_CANCEL:
    case OrderStatus.FRAME_OPERATOR_REJECT:
    default:
      return <Tag>{item?.statusName}</Tag>
  }
}

export default OrderStatusTag
