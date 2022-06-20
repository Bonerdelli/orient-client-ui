import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'components/Div'

import { OrderWizardType } from 'library/models' // TODO: from ui-lib

import './OrderStepOptionalParameters.style.less'

const { Title } = Typography

export interface OrderStepOptionalParametersProps {
  orderId?: number
  oprderType?: OrderWizardType
  currentStep: number
  setCurrentStep: (step: number) => void
}

const OrderStepOptionalParameters: React.FC<OrderStepOptionalParametersProps> = ({
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
    <Div className="OrderStepOptionalParameters">
      <Title level={5}>{t('orderStepOptionalParameters.title')}</Title>
    </Div>
  )
  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepOptionalParameters
