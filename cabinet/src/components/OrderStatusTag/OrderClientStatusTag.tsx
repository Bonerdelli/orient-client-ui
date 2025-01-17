import { useTranslation } from 'react-i18next'
import { Tag, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import {
  Order,
  OrderStatus,
  FactoringStatus,
} from 'orient-ui-library/library/models/order'

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
    case OrderStatus.FRAME_DRAFT:
    case FactoringStatus.FACTOR_DRAFT:
      return <Tag>{t('orderStatusTitles.draft')}</Tag>
    case OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY:
    case OrderStatus.FRAME_OPERATOR_VERIFYING:
    case FactoringStatus.FACTOR_OPERATOR_WAIT_FOR_VERIFY:
    case FactoringStatus.FACTOR_OPERATOR_VERIFY:
      return <Tag color="blue">{t('orderStatusTitles.verifying')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CLIENT_REWORK:
      return <Tag color="green">{t('orderStatusTitles.needsForRework')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CLIENT_SIGN:
    case FactoringStatus.FACTOR_CLIENT_SIGN:
      return <Tag color="green">{t('orderStatusTitles.clientSign')}{refreshButton}</Tag>
    case OrderStatus.FRAME_BANK_VERIFYING:
      return <Tag color="blue">{t('orderStatusTitles.bankVerify')}{refreshButton}</Tag>
    case FactoringStatus.FACTOR_BANK_SIGN:
    case OrderStatus.FRAME_BANK_SIGN:
      return <Tag color="blue">{t('orderStatusTitles.bankSign')}{refreshButton}</Tag>
    case OrderStatus.FRAME_HAS_OFFER:
      return <Tag color="green">{t('orderStatusTitles.hasOffer')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CUSTOMER_SIGN:
    case FactoringStatus.FACTOR_CUSTOMER_SIGN:
      return <Tag color="blue">{t('orderStatusTitles.customerSign')}{refreshButton}</Tag>
    case OrderStatus.FRAME_CANCEL:
    case FactoringStatus.FACTOR_CANCEL:
      return <Tag>{t('orderStatusTitles.cancel')}</Tag>
    case OrderStatus.FRAME_OPERATOR_REJECT:
    case FactoringStatus.FACTOR_OPERATOR_REJECT:
      return <Tag color="red">{t('orderStatusTitles.operatorReject')}</Tag>
    case OrderStatus.FRAME_COMPLETED:
    case FactoringStatus.FACTOR_COMPLETED:
      return <Tag color="blue">{t('orderStatusTitles.completed')}</Tag>
    case FactoringStatus.FACTOR_WAIT_FOR_CHARGE:
      return <Tag color="blue">{t('orderStatusTitles.factorWaitForCharge')}</Tag>
    case FactoringStatus.FACTOR_CHARGED:
      return <Tag color="blue">{t('orderStatusTitles.factorCharged')}</Tag>
    default:
      // NOTE: unknown statutes shouldn't be displayed
      return <></> // <Tag>{item.statusName}{refreshButton}</Tag>
  }
}

export default OrderStatusTag
