import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'orient-ui-library/components/Div'

import { OrderWizardType } from 'orient-ui-library/library/models'

import './OrderStepDocuments.style.less'

const { Title } = Typography

export interface OrderStepDocumentsProps {
  bankId?: number
  orderId?: number
  oprderType?: OrderWizardType
  currentStep: number
  setCurrentStep: (step: number) => void
}

const OrderStepDocuments: React.FC<OrderStepDocumentsProps> = ({
  // bankId,
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
    <Div className="OrderStepDocuments">
      <Title level={5}>{t('orderStepDocuments.title')}</Title>
    </Div>
  )
  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepDocuments
