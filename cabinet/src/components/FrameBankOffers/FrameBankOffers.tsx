import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'components/Div'

import { FrameWizardType } from 'library/api'

import './FrameBankOffers.style.less'

const { Title } = Typography

export interface FrameBankOffersProps {
  wizardType?: FrameWizardType
  companyId?: number
  orderId?: number
  customerId?: number
  currentStep: number
  setCurrentStep: (step: number) => void
}

const FrameBankOffers: React.FC<FrameBankOffersProps> = ({
  // wizardType = FrameWizardType.Full,
  // companyId,
}) => {
  const { t } = useTranslation()
  const renderActions = () => (
    <></>
  )
  const renderStepContent = () => (
    <Div className="FrameBankOffers">
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

export default FrameBankOffers
