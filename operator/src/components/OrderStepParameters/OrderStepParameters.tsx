import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, message, Row, Skeleton } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import ClientInfo from 'orient-ui-library/components/ClientInfo'
import OrderInfo from 'orient-ui-library/components/OrderInfo'

import { OrderStatus } from 'orient-ui-library/library/models/order'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { FrameWizardStep1Response, getFrameWizardStep, sendFrameWizardStep1 } from 'library/api/frameWizard'

import './OrderStepParameters.style.less'

export interface OrderStepParametersProps {
  wizardType?: FrameWizardType
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: OrderStatus) => void
}

const OrderStepParameters: React.FC<OrderStepParametersProps> = ({
  wizardType = FrameWizardType.Full,
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
  setOrderStatus,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)

  const [ stepData, setStepData ] = useState<FrameWizardStep1Response>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  console.log('wizardType', wizardType)

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      type: wizardType,
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<FrameWizardStep1Response>).data)
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
    const result = await sendFrameWizardStep1({
      type: wizardType,
      orderId,
    }, {})
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setOrderStatus(OrderStatus.FRAME_OPERATOR_VERIFYING)
      setCurrentStep(sequenceStepNumber + 1)
    }
    setSubmitting(false)
  }

  const handleNextStep = () => {
    if (currentStep <= sequenceStepNumber) {
      sendNextStep()
    } else {
      setCurrentStep(sequenceStepNumber + 1)
    }
  }

  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col flex={1}></Col>
      <Col>{currentStep > sequenceStepNumber
        ? renderNextButton()
        : renderSubmitButton()}</Col>
    </Row>
  )

  const renderNextButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={() => setCurrentStep(sequenceStepNumber + 1)}
      disabled={!isNextStepAllowed}
    >
      {t('common.actions.next.title')}
    </Button>
  )

  const renderSubmitButton = () => (
    <Button
      size="large"
      type="primary"
      disabled={submitting}
      onClick={handleNextStep}
    >
      Взять на проверку
    </Button>
  )

  const renderStepContent = () => (
    <Div className="OrderStepParameters">
      <Row gutter={12}>
        <Col span={12}>
          <ClientInfo
            company={stepData?.clientCompany}
            companyHead={stepData?.clientCompanyFounder}
            companyRequisites={stepData?.clientCompanyRequisites}
          />
        </Col>
        <Col span={12}>
          <OrderInfo
            orderId={orderId}
            customerCompany={stepData?.customerCompany}
          />
        </Col>
      </Row>
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
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepParameters
