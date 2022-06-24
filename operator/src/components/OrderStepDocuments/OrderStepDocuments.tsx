import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Button, Skeleton } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { OrderWizardType } from 'orient-ui-library/library/models/order'
import { WizardStepResponse } from 'orient-ui-library/library/models/wizard'

import './OrderStepDocuments.style.less'

const { Title } = Typography

export interface OrderStepDocumentsProps {
  orderId?: number
  orderType?: OrderWizardType
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepDocuments: React.FC<OrderStepDocumentsProps> = ({
  orderId,
  // orderType,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setIsNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setIsPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<unknown>() // TODO: ask be to make typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      step: currentStep,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as WizardStepResponse<unknown>).data) // TODO: ask be to make typings
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
    setIsNextStepAllowed(true) // NOTE: only for debugging
  }

  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col flex={1}>{renderPrevButton()}</Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const sendNextStep = async () => {
    setSubmitting(true)
  }

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(sequenceStepNumber - 1)
    }
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const renderNextButton = () => (
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

  const renderPrevButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handlePrevStep}
      disabled={submitting}
      loading={submitting}
    >
      {t('orders.actions.next.title')}
    </Button>
  )

  const renderStepContent = () => (
    <Div className="OrderStepDocuments">
      <Title level={5}>{t('orderStepDocuments.title')}</Title>
    </Div>
  )

  if (!stepData && stepDataLoading) {
    return (
      <Skeleton active={true} />
    )
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning" />
    )
  }

  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepDocuments
