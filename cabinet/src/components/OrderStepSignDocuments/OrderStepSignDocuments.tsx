import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Button, Result, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import { FrameOrderStatus } from 'orient-ui-library/library/models/order'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

import { sendFrameWizardStep3 } from 'library/api'

import './OrderStepSignDocuments.style.less'

const { Title } = Typography

export interface OrderSignDocumentsProps {
  wizardType?: FrameWizardType
  orderId?: number
  orderStatus?: FrameOrderStatus
  companyId?: number
  customerId?: number
  currentStep: number
  setCurrentStep: (step: number) => void
}

const OrderStepSignDocuments: React.FC<OrderSignDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  orderStatus = FrameOrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY,
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

  const renderRejectButton = () => (
    <Button
      danger
      size="large"
      type="default"
    >
      {t('frameSteps.signDocuments.actions.reject.title')}
    </Button>
  )

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

  const renderStepActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col>{renderCancelButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const renderWaitActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col>{renderRejectButton()}</Col>
    </Row>
  )

  const renderWaitMessage = () => (
    <Result
      title={t('frameSteps.signDocuments.waitForOperator.title')}
      subTitle={t('frameSteps.signDocuments.waitForOperator.desc')}
    />
  )

  const renderStepContent = () => (
    <Div className="OrderStepSignDocuments">
      <Title level={5}>{t('frameSteps.signDocuments.sectionTitles.signDocuments')}</Title>
    </Div>
  )

  const isVerifying = orderStatus === FrameOrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY

  return (
    <Div className="FrameWizard__step__content">
      {isVerifying ? renderWaitMessage() : renderStepContent()}
      {isVerifying ? renderWaitActions() : renderStepActions()}
    </Div>
  )
}

export default OrderStepSignDocuments
