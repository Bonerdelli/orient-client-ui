import { useTranslation } from 'react-i18next'
import { Tag, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import { Order, OrderStatus, FactoringStatus } from 'orient-ui-library/library/models/order'

import './OrderStatusTag.style.less'

export interface OrderStatusTagProps {
  statusCode?: OrderStatus | FactoringStatus,
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
    case FactoringStatus.FACTOR_CUSTOMER_SIGN:
      return <Tag color="green">{t('orderStatusCustomerTitles.customerSign')}{refreshButton}</Tag>
    case FactoringStatus.FACTOR_BANK_SIGN:
      return <Tag color="blue">{t('orderStatusCustomerTitles.bankVerify')}{refreshButton}</Tag>
    case OrderStatus.FRAME_COMPLETED:
    case FactoringStatus.FACTOR_COMPLETED:
      return <Tag color="blue">{t('orderStatusCustomerTitles.completed')}</Tag>
    case FactoringStatus.FACTOR_WAIT_FOR_CHARGE:
      return <Tag color="blue">{t('orderStatusCustomerTitles.factorWaitForCharge')}</Tag>
    case FactoringStatus.FACTOR_CHARGED:
      return <Tag color="blue">{t('orderStatusCustomerTitles.factorCharged')}</Tag>
    case FactoringStatus.FACTOR_COMPLETED:
      return <Tag color="blue">{t('orderStatusCustomerTitles.factorCompleted')}</Tag>
    default:
      // NOTE: unknown statutes shouldn't be displayed
      return <></> // <Tag>{item.statusName}{refreshButton}</Tag>
  }
}

export default OrderStatusTag
