import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'orient-ui-library/components/Div'

import { OrderWizardType } from 'orient-ui-library/library/models'

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
