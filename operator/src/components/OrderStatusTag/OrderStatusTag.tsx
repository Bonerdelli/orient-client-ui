import { useTranslation } from 'react-i18next'
import { Button, Tag, TagProps } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import { FactoringStatus, Order, OrderStatus } from 'orient-ui-library/library/models/order'

import './OrderStatusTag.style.less'

export interface OrderStatusTagProps extends TagProps {
  statusCode?: OrderStatus | FactoringStatus,
  refreshAction?: () => void
  item?: Order,
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({
  statusCode,
  refreshAction,
  item,
  ...rest
}) => {
  const { t } = useTranslation()

  const refreshButton = refreshAction ? (
    <Button
      className="OrderStatusTag__refreshButton"
      icon={<ReloadOutlined/>}
      onClick={refreshAction}
      type="link"
      size="small"
    />
  ) : <></>

  switch (statusCode) {
    case OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY:
    case FactoringStatus.FACTOR_OPERATOR_WAIT_FOR_VERIFY:
      return <Tag color="green" {...rest}>{t('orderStatusTitles.waitForVerify')}{refreshButton}</Tag>
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
    case FactoringStatus.FACTOR_OPERATOR_VERIFY:
      return <Tag color="green" {...rest}>{t('orderStatusTitles.verifying')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CLIENT_SIGN:
    case FactoringStatus.FACTOR_CLIENT_SIGN:
      return <Tag color="blue" {...rest}>{t('orderStatusTitles.clientSign')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CLIENT_REWORK:
    case FactoringStatus.FACTOR_CLIENT_REWORK:
      return <Tag color="blue" {...rest}>{t('orderStatusTitles.needsForRework')}{refreshButton}</Tag>
    case OrderStatus.FRAME_BANK_VERIFYING:
      return <Tag color="blue" {...rest}>{t('orderStatusTitles.bankVerify')}{refreshButton}</Tag>
    case OrderStatus.FRAME_HAS_OFFER:
      return <Tag color="blue" {...rest}>{t('orderStatusTitles.hasOffer')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CUSTOMER_SIGN:
    case FactoringStatus.FACTOR_CUSTOMER_SIGN:
      return <Tag color="blue" {...rest}>{t('orderStatusTitles.customerSign')}{refreshButton}</Tag>
    case FactoringStatus.FACTOR_BANK_SIGN:
    case OrderStatus.FRAME_BANK_SIGN:
      return <Tag color="blue" {...rest}>{t('orderStatusTitles.bankSign')}{refreshButton}</Tag>
    case FactoringStatus.FACTOR_WAIT_FOR_CHARGE:
      return <Tag color="blue" {...rest}>{t('orderStatusTitles.waitForCharge')}</Tag>
    case FactoringStatus.FACTOR_CHARGED:
      return <Tag color="blue" {...rest}>{t('orderStatusTitles.charged')}</Tag>
    case OrderStatus.FRAME_COMPLETED:
    case FactoringStatus.FACTOR_COMPLETED:
      return <Tag color="blue" {...rest}>{t('orderStatusTitles.completed')}</Tag>
    case OrderStatus.FRAME_CANCEL:
    case FactoringStatus.FACTOR_CANCEL:
      return <Tag>{t('orderStatusTitles.cancel')}</Tag>
    case OrderStatus.FRAME_OPERATOR_REJECT:
    case FactoringStatus.FACTOR_OPERATOR_REJECT:
      return <Tag color="red" {...rest}>{t('orderStatusTitles.operatorReject')}</Tag>
    default:
      return <Tag {...rest}>{item?.statusName}</Tag>
  }
}

export default OrderStatusTag
