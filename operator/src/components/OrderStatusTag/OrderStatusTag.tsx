import { useTranslation } from 'react-i18next'
import { Tag, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import { Order, OrderStatus } from 'orient-ui-library/library/models/order'

import './OrderStatusTag.style.less'

export interface OrderStatusTagProps {
  statusCode?: OrderStatus,
  refreshAction?: () => void
  item?: Order,
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({
  statusCode,
  refreshAction,
  item,
}) => {
  const { t } = useTranslation()

  const refreshButton = refreshAction ? (
    <Button
      className="OrderStatusTag__refreshButton"
      icon={<ReloadOutlined />}
      onClick={refreshAction}
      type="link"
      size="small"
    />
  ) : <></>

  switch (statusCode) {
    case OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY:
      return <Tag color="green">{t('orderStatusTitles.waitForVerify')}{refreshButton}</Tag>
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
      return <Tag color="green">{t('orderStatusTitles.verifying')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CLIENT_SIGN:
      return <Tag color="blue">{t('orderStatusTitles.clientSign')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CLIENT_REWORK:
      return <Tag color="blue">{t('orderStatusTitles.needsForRework')}{refreshButton}</Tag>
    case OrderStatus.FRAME_BANK_VERIFYING:
      return <Tag color="blue">{t('orderStatusTitles.bankVerify')}{refreshButton}</Tag>
    case OrderStatus.FRAME_HAS_OFFER:
      return <Tag color="blue">{t('orderStatusTitles.hasOffer')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CUSTOMER_SIGN:
      return <Tag color="blue">{t('orderStatusTitles.customerSign')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CANCEL:
      return <Tag>{t('orderStatusTitles.cancel')}</Tag>
    case OrderStatus.FRAME_OPERATOR_REJECT:
      return <Tag color="red">{t('orderStatusTitles.operatorReject')}</Tag>
    case OrderStatus.FRAME_COMPLETED:
    default:
      return <Tag>{item?.statusName}</Tag>
  }
}

export default OrderStatusTag
