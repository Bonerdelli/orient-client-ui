/**
 * NOTE: almost blank wizard step
 * TODO: add commponent template for this?
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Button, message } from 'antd'

import Div from 'components/Div'

import { FrameWizardType, sendFrameWizardStep3 } from 'library/api'

import './OrderSignDocuments.style.less'

const { Title } = Typography

export interface OrderSignDocumentsProps {
  wizardType?: FrameWizardType
  orderId?: number
  companyId?: number
  customerId?: number
  currentStep: number
  setCurrentStep: (step: number) => void
}

const OrderSignDocuments: React.FC<OrderSignDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  currentStep,
  setCurrentStep,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setIsNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setIsPrevStepAllowed ] = useState<boolean>(true)
  const [ submitting, setSubmitting ] = useState<boolean>()

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep3({
      type: wizardType,
      companyId,
      orderId,
    }, {

    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setIsNextStepAllowed(false)
    } else {
      setCurrentStep(currentStep + 1)
    }
    setSubmitting(false)
  }


  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const renderCancelButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handlePrevStep}
        disabled={!isPrevStepAllowed}
      >
        {t('common.actions.back.title')}
      </Button>
    )
  }

  const renderNextButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handleNextStep}
        disabled={!isNextStepAllowed || submitting}
        loading={submitting}
      >
        {t('orders.actions.next.title')}
      </Button>
    )
  }

  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col>{renderCancelButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const renderStepContent = () => (
    <Div className="OrderSignDocuments">
      <Title level={5}>{t('frameSteps.signDocuments.sectionTitles.signDocuments')}</Title>
    </Div>
  )

  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderSignDocuments
