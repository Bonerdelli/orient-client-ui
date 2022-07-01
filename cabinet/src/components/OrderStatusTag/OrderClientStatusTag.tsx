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

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ statusCode, refreshAction }) => {
  const { t } = useTranslation()
  let refreshButton: JSX.Element | null = null
  if (refreshAction) {
    refreshButton = (
      <Button
        className="OrderStatusTag__refreshButton"
        icon={<ReloadOutlined />}
        onClick={refreshAction}
        type="link"
        size="small"
      />
    )
  }
  switch (statusCode) {
    case OrderStatus.FRAME_DRAFT:
      return <Tag>{t('orderStatusTitles.draft')}{refreshButton}</Tag>
    case OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY:
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
      return <Tag color="blue">{t('orderStatusTitles.verifying')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CLIENT_REWORK:
      return <Tag color="green">{t('orderStatusTitles.needsForRework')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CLIENT_SIGN:
      return <Tag color="green">{t('orderStatusTitles.clientSign')}{refreshButton}</Tag>
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
      return <Tag color="blue">{t('orderStatusTitles.bankVerify')}{refreshButton}</Tag>
    case OrderStatus.FRAME_HAS_OFFER:
      return <Tag color="green">{t('orderStatusTitles.hasOffer')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CUSTOMER_SIGN:
      return <Tag color="blue">{t('orderStatusTitles.customerSign')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CANCEL:
      return <Tag>{t('orderStatusTitles.cancel')}{refreshButton}</Tag>
    case OrderStatus.FRAME_OPERATOR_REJECT:
      return <Tag color="red">{t('orderStatusTitles.operatorReject')}{refreshButton}</Tag>
    case OrderStatus.FRAME_COMPLETED:
      return <Tag>{t('orderStatusTitles.completed')}{refreshButton}</Tag>
    default:
      // NOTE: unknown statutes shouldn't be displayed
      return <></> // <Tag>{item.statusName}{refreshButton}</Tag>
  }
}

export default OrderStatusTag
