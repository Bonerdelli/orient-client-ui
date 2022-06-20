import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'components/Div'

import { OrderWizardType } from 'library/models' // TODO: from ui-lib

import './OrderStepScoringResults.style.less'

const { Title } = Typography

export interface OrderStepScoringResultsProps {
  orderId?: number
  oprderType?: OrderWizardType
  currentStep: number
  setCurrentStep: (step: number) => void
}

const OrderStepScoringResults: React.FC<OrderStepScoringResultsProps> = ({
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
    <Div className="OrderStepScoringResults">
      <Title level={5}>{t('orderStepScoringResult.title')}</Title>
    </Div>
  )
  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepScoringResults
