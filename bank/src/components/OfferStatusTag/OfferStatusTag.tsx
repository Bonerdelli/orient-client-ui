import { useTranslation } from 'react-i18next'
import { Tag, TagProps, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { FactoringStatus, OrderStatus } from 'orient-ui-library/library/models/order'

import './OfferStatusTag.style.less'

export interface OfferStatusTagProps extends TagProps {
  statusCode?: BankOfferStatus | FactoringStatus | OrderStatus,
  refreshAction?: () => void
}

const OfferStatusTag: React.FC<OfferStatusTagProps> = ({
  statusCode,
  refreshAction,
  ...rest
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
    case BankOfferStatus.BankWaitForVerify:
      return <Tag color="green" {...rest}>{t('offerStatusTitles.bankWaitForVerify')}{refreshButton}</Tag>
    case BankOfferStatus.BankViewed:
      return <Tag color="green" {...rest}>{t('offerStatusTitles.bankViewed')}{refreshButton}</Tag>
    case BankOfferStatus.BankVerify:
      return <Tag color="green" {...rest}>{t('offerStatusTitles.bankVerify')}{refreshButton}</Tag>
    case BankOfferStatus.BankOffer:
      return <Tag color="green" {...rest}>{t('offerStatusTitles.bankOffer')}{refreshButton}</Tag>
    case BankOfferStatus.ClientRework:
      return <Tag color="green" {...rest}>{t('offerStatusTitles.clientRework')}{refreshButton}</Tag>
    // TODO: unify enum naming
    case BankOfferStatus.BankSign:
    case FactoringStatus.FACTOR_BANK_SIGN:
    case OrderStatus.FRAME_BANK_SIGN:
      return <Tag color="green" {...rest}>{t('offerStatusTitles.bankSign')}{refreshButton}</Tag>
    case BankOfferStatus.BankOfferSent:
      return <Tag color="green" {...rest}>{t('offerStatusTitles.bankOfferSent')}{refreshButton}</Tag>
    // NOTE: no such status in proccess, need for check
    // case BankOfferStatus.NeedsForRework:
    //   return <Tag color="blue" {...rest}>{t('offerStatusTitles.needsForRework')}{refreshButton}</Tag>
    case BankOfferStatus.CustomerSign:
    case FactoringStatus.FACTOR_CUSTOMER_SIGN:
    case OrderStatus.FRAME_CUSTOMER_SIGN:
      return <Tag color="blue" {...rest}>{t('offerStatusTitles.customerSign')}{refreshButton}</Tag>
    case BankOfferStatus.Completed:
    case OrderStatus.FRAME_COMPLETED:
      return <Tag color="blue" {...rest}>{t('offerStatusTitles.completed')}</Tag>
    case FactoringStatus.FACTOR_WAIT_FOR_CHARGE:
      return <Tag color="green" {...rest}>{t('offerStatusTitles.factorWaitForCharge')}</Tag>
    case FactoringStatus.FACTOR_CHARGED:
      return <Tag color="green" {...rest}>{t('offerStatusTitles.factorCharged')}</Tag>
    case FactoringStatus.FACTOR_COMPLETED:
      return <Tag color="blue" {...rest}>{t('offerStatusTitles.factorCompleted')}</Tag>
    case OrderStatus.FRAME_BANK_REJECT:
    case FactoringStatus.FACTOR_BANK_REJECT:
    case BankOfferStatus.BankReject:
      return <Tag color="red" {...rest}>{t('offerStatusTitles.bankReject')}</Tag>
    case BankOfferStatus.ClientOfferReject:
      return <Tag color="red" {...rest}>{t('offerStatusTitles.clientReject')}</Tag>
    default:
      // NOTE: unknown statutes shouldn't be displayed
      return <></>
  }
}

export default OfferStatusTag
