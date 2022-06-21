import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'orient-ui-library/components/Div'

import { OrderWizardType } from 'library/models' // TODO: from ui-lib

import './OrderStepArchive.style.less'

const { Title } = Typography

export interface OrderStepArchiveProps {
  bankId?: number
  orderId?: number
  oprderType?: OrderWizardType
  currentStep: number
  setCurrentStep: (step: number) => void
}

const OrderStepArchive: React.FC<OrderStepArchiveProps> = ({
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
    <Div className="OrderStepArchive">
      <Title level={5}>{t('orderStepArchive.title')}</Title>
    </Div>
  )
  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepArchive
