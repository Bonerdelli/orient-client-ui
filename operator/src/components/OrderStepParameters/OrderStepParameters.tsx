import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'components/Div'

import { OrderWizardType } from 'library/models' // TODO: from ui-lib

import './OrderStepParameters.style.less'

const { Title } = Typography

export interface OrderStepParametersProps {
  orderId?: number
  oprderType?: OrderWizardType
  currentStep: number
  setCurrentStep: (step: number) => void
}

const OrderStepParameters: React.FC<OrderStepParametersProps> = ({
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
    <Div className="OrderStepParameters">
      <Title level={5}>{t('orderStepParameters.title')}</Title>
    </Div>
  )
  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepParameters
