import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'components/Div'

import { OrderWizardType } from 'library/models' // TODO: from ui-lib

import './OrderStepStopFactors.style.less'

const { Title } = Typography

export interface OrderStepStopFactorsProps {
  orderId?: number
  oprderType?: OrderWizardType
  currentStep: number
  setCurrentStep: (step: number) => void
}

const OrderStepStopFactors: React.FC<OrderStepStopFactorsProps> = ({
  // orderId,
  // oprderType,
  // currentStep,
  // setCurrentStep,
}) => {
  const { t } = useTranslation()
  const renderActions = () => (
    <></>
  )
  const renderStepContent = () => (
    <Div className="OrderStepStopFactors">
      <Title level={5}>{t('orderStepStopFactors.title')}</Title>
    </Div>
  )
  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepStopFactors
