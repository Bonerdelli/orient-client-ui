import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Button, Skeleton, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { WizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'

import {
  getFrameWizardStep,
  sendFrameWizardStep, // NOTE: replace ep with correct one!
} from 'library/api/frameWizard'

import './OrderStepBankOffers.style.less'

const { Title } = Typography

export interface OrderStepBankOffersProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepBankOffers: React.FC<OrderStepBankOffersProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<unknown>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      // NOTE: only for debugging
      setNextStepAllowed(true)
    }
  }, [currentStep, sequenceStepNumber])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      type: wizardType,
      step: sequenceStepNumber,
      companyId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as WizardStepResponse<unknown>).data) // TODO: ask be to generate typings
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
    setNextStepAllowed(true) // NOTE: only for debugging
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep({
      step: sequenceStepNumber,
      type: wizardType,
      companyId,
      orderId,
    }, {})
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setCurrentStep(sequenceStepNumber + 1)
    }
    setSubmitting(false)
  }

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(sequenceStepNumber - 1)
    }
  }

  const handleStepSubmit = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col flex={1}>{renderPrevButton()}</Col>
      <Col>{currentStep > sequenceStepNumber
        ? renderNextButton()
        : renderSubmitButton()}</Col>
    </Row>
  )

  const renderSubmitButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handleStepSubmit}
      disabled={!isNextStepAllowed || submitting}
      loading={submitting}
    >
      {t('common.actions.saveAndContinue.title')}
    </Button>
  )

  const renderNextButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handleNextStep}
      disabled={!isNextStepAllowed || submitting}
    >
      {t('orderActions.saveAndContinue.title')}
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
      {t('common.actions.back.title')}
    </Button>
  )

  const renderStepContent = () => (
    <Div className="OrderStepBankOffers">
      <Title level={5}>{t('frameSteps.bankOffers.bankList.title')}</Title>
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
    <Div className="WizardStep__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepBankOffers
