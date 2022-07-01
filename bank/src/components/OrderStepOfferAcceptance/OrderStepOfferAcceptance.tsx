import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Button, Skeleton, Result, message } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { WizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import {
  getFrameWizardStep,
  sendFrameWizardStep1, // NOTE: replace ep with correct one!
} from 'library/api/frameWizard'

import './OrderStepOfferAcceptance.style.less'

export interface BlankWizardStepProps {
  bankId?: number | bigint
  orderId?: number
  orderStatus?: BankOfferStatus
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepOfferAcceptance: React.FC<BlankWizardStepProps> = ({
  bankId,
  orderId,
  currentStep,
  orderStatus,
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
  const [ isWaiting, setWaiting ] = useState<boolean>()

  useEffect(() => {
    if (isWaiting === false) {
      loadCurrentStepData()
    }
  }, [isWaiting])

  useEffect(() => {
    if (orderStatus) {
      setWaiting(orderStatus === BankOfferStatus.CustomerSign)
    }
  }, [orderStatus])

  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      setNextStepAllowed(true)
    }
  }, [currentStep, sequenceStepNumber])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      step: sequenceStepNumber,
      bankId,
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
    const result = await sendFrameWizardStep1({ // NOTE: replace ep with correct!
      bankId,
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
    </Row>
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
    <Div className="OrderStepOfferAcceptance">
      <Result
        icon={<InfoCircleFilled />}
        title={t('orderStepOfferAcceptance.waitForAccept.title')}
        subTitle={t('orderStepOfferAcceptance.waitForAccept.desc')}
      />
    </Div>
  )

  if (isWaiting) {
    return (
      <Result
        icon={<InfoCircleFilled />}
        title={t('orderStepOfferAcceptance.waitForAccept.title')}
        subTitle={t('orderStepOfferAcceptance.waitForAccept.desc')}
      />
    )
  }

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

export default OrderStepOfferAcceptance
