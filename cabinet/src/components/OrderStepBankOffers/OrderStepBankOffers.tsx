import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'orient-ui-library/components/Div'

import { FrameWizardType } from 'library/api'

import './OrderStepBankOffers.style.less'

const { Title } = Typography

export interface OrderBankOffersProps {
  wizardType?: FrameWizardType
  companyId?: number
  orderId?: number
  customerId?: number
  currentStep: number
  setCurrentStep: (step: number) => void
}

const OrderStepBankOffers: React.FC<OrderBankOffersProps> = ({
  // wizardType = FrameWizardType.Full,
  // companyId,
}) => {
  const { t } = useTranslation()
  const renderActions = () => (
    <></>
  )
  const renderStepContent = () => (
    <Div className="OrderStepBankOffers">
      <Title level={5}>{t('frameSteps.bankOffers.bankList.title')}</Title>
    </Div>
  )
  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepBankOffers
