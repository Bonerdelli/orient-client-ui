import { useTranslation } from 'react-i18next'
import { Tag, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import './OfferStatusTag.style.less'

export interface OfferStatusTagProps {
  statusCode?: BankOfferStatus,
  refreshAction?: () => void
}

const OfferStatusTag: React.FC<OfferStatusTagProps> = ({ statusCode, refreshAction }) => {
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
      return <Tag color="green">{t('offerStatusTitles.bankWaitForVerify')}{refreshButton}</Tag>
    case BankOfferStatus.BankViewed:
      return <Tag color="green">{t('offerStatusTitles.bankViewed')}{refreshButton}</Tag>
    case BankOfferStatus.BankVerify:
      return <Tag color="green">{t('offerStatusTitles.bankVerify')}{refreshButton}</Tag>
    case BankOfferStatus.BankOffer:
      return <Tag color="green">{t('offerStatusTitles.bankOffer')}{refreshButton}</Tag>
    case BankOfferStatus.BankSign:
      return <Tag color="green">{t('offerStatusTitles.bankSign')}{refreshButton}</Tag>
    case BankOfferStatus.BankOfferSent:
      return <Tag color="green">{t('offerStatusTitles.bankOfferSent')}{refreshButton}</Tag>
    // NOTE: no such status in proccess, need for check
    // case BankOfferStatus.NeedsForRework:
    //   return <Tag color="blue">{t('offerStatusTitles.needsForRework')}{refreshButton}</Tag>
    case BankOfferStatus.CustomerSign:
      return <Tag color="blue">{t('offerStatusTitles.customerSign')}{refreshButton}</Tag>
    case BankOfferStatus.Completed:
      return <Tag color="blue">{t('offerStatusTitles.completed')}</Tag>
    default:
      // NOTE: unknown statutes shouldn't be displayed
      return <></>
  }
}

export default OfferStatusTag
