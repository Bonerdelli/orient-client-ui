import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Button, Skeleton, Result, message } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { OrderStatus } from 'orient-ui-library/library/models/order'

import { getFrameSimpleWizardStep, sendFrameSimpleWizardStep } from 'library/api/frameSimpleWizard'

import './OrderStepSendToBank.style.less'

export interface OrderStepSendToBankProps {
  orderId?: number
  orderStatus?: OrderStatus,
  setOrderStatus: (status: OrderStatus) => void
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepSendToBank: React.FC<OrderStepSendToBankProps> = ({
  orderId,
  currentStep,
  orderStatus,
  setOrderStatus,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ bankName, setBankName ] = useState<string>()
  const [ completed, setCompleted ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    setNextStepAllowed(currentStep === sequenceStepNumber)
  }, [ currentStep ])

  useEffect(() => {
    setCompleted(orderStatus !== OrderStatus.FRAME_OPERATOR_VERIFYING)
  }, [ orderStatus ])

  useEffect(() => {
    if (stepData?.bank?.bankName) {
      setBankName(stepData.bank.bankName)
    }
  }, [ stepData ])

  const loadCurrentStepData = async () => {
    const result = await getFrameSimpleWizardStep({
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<unknown>).data) // TODO: ask be to generate typings
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameSimpleWizardStep({
      step: sequenceStepNumber,
      orderId,
    }, {})
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setOrderStatus(OrderStatus.FRAME_CLIENT_SIGN)
    }
    setSubmitting(false)
  }

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(sequenceStepNumber - 1)
    }
  }

  const renderActions = () => (
    <Row>
      <Col flex={1}>{renderPrevButton()}</Col>
      <Col>{!completed && renderSubmitButton()}</Col>
    </Row>
  )

  const renderPrevButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handlePrevStep}
    >
      {t('common.actions.back.title')}
    </Button>
  )

  const renderSubmitButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={sendNextStep}
      disabled={!isNextStepAllowed || submitting}
      loading={submitting}
    >
      {t('orderStepSendToBank.actionButton.title')}
    </Button>
  )

  const renderReadyForSendingContent = () => (
    <Div className="OrderStepSendToBank">
      <Result
        icon={<InfoCircleFilled />}
        title={t('orderStepSendToBank.readyForSending.title')}
        subTitle={bankName ? t(
          'orderStepSendToBank.readyForSending.desc',
          { bankName },
        ) : ' '}
      />
    </Div>
  )

  const renderOrderSentContent = () => (
    <Div className="OrderStepSendToBank">
      <Result
        status="success"
        title={t('orderStepSendToBank.sent.title')}
        subTitle={bankName ? t(
          'orderStepSendToBank.sent.desc',
          { bankName },
        ) : ' '}
      />
    </Div>
  )

  if (!stepData && stepDataLoading) {
    return (
      <Skeleton active={true}/>
    )
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning"/>
    )
  }

  return (
    <Div className="FrameWizard__step__content">
      {!completed ? renderReadyForSendingContent() : renderOrderSentContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepSendToBank
