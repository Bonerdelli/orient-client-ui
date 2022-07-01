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
    case OrderStatus.FRAME_CUSTOMER_SIGN:
      return <Tag color="green">{t('orderStatusCustomerTitles.customerSign')}{refreshButton}</Tag>
    case OrderStatus.FRAME_COMPLETED:
      return <Tag color="blue">{t('orderStatusCustomerTitles.completed')}</Tag>
    default:
      // NOTE: unknown statutes shouldn't be displayed
      return <></> // <Tag>{item.statusName}{refreshButton}</Tag>
  }
}

export default OrderStatusTag
