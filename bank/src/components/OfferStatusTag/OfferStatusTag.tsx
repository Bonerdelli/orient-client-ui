import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'

import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import './OfferStatusTag.style.less'

export interface OfferStatusTagProps {
  statusCode: BankOfferStatus,
}

const OfferStatusTag: React.FC<OfferStatusTagProps> = ({ statusCode }) => {
  const { t } = useTranslation()
  switch (statusCode) {
    case BankOfferStatus.BankWaitForVerify:
      return <Tag color="green">{t('offerStatusTitles.bankWaitForVerify')}</Tag>
    case BankOfferStatus.BankViewed:
      return <Tag color="green">{t('offerStatusTitles.bankViewed')}</Tag>
    case BankOfferStatus.BankVerify:
      return <Tag color="green">{t('offerStatusTitles.bankVerify')}</Tag>
    case BankOfferStatus.BankOffer:
      return <Tag color="green">{t('offerStatusTitles.bankOffer')}</Tag>
    case BankOfferStatus.BankSign:
      return <Tag color="green">{t('offerStatusTitles.bankSign')}</Tag>
    case BankOfferStatus.BankOfferSent:
      return <Tag color="green">{t('offerStatusTitles.bankOfferSent')}</Tag>

    case BankOfferStatus.NeedsForRework:
      return <Tag color="blue">{t('offerStatusTitles.needsForRework')}</Tag>
    case BankOfferStatus.CustomerSign:
      return <Tag color="blue">{t('offerStatusTitles.customerSign')}</Tag>
    case BankOfferStatus.Completed:
      return <Tag>{t('offerStatusTitles.completed')}</Tag>
    default:
      // NOTE: unknown statutes shouldn't be displayed
      return <></>
  }
}

export default OfferStatusTag
