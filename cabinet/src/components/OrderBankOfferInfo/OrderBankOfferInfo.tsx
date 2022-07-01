import { useTranslation } from 'react-i18next'
import { Typography, Button, Skeleton } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { BankOffer, BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import Div from 'orient-ui-library/components/Div'

import './OrderBankOfferInfo.style.less'

const { Title, Paragraph } = Typography

export interface OrderBankOfferInfoProps {
  offer: BankOffer
  onBack: () => void
}

const OrderBankOfferInfo: React.FC<OrderBankOfferInfoProps> = ({ offer, onBack }) => {
  const { t } = useTranslation()

  const renderStatus = () => {
    if (offer.offerStatus === BankOfferStatus.BankOfferSent) {
      return (
        <Skeleton></Skeleton>
      )
    }
    return (
      <Paragraph>{t('orderStepBankOffer.statuses.waitingForBank.title')}</Paragraph>
    )
  }


  return (
    <Div className="OrderBankOfferInfo">
      <Div className="OrderBankOfferInfo__navigateBack">
        <Button
          icon={<ArrowLeftOutlined />}
          type="link"
          size="middle"
          onClick={onBack}
        >
          {t('orderStepBankOffer.navigateBack.title')}
        </Button>
      </Div>
      <Title level={5}>
        {t('orderStepBankOffer.title', { bankName: offer.bank.name })}
      </Title>
      {renderStatus()}
    </Div>
  )
}

export default OrderBankOfferInfo
