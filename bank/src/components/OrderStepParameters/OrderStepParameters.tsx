import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Button, Skeleton, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import ClientInfo from 'orient-ui-library/components/ClientInfo'
import OrderInfo from 'orient-ui-library/components/OrderInfo'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

import { FrameWizardStep1Response, getFrameWizardStep, sendFrameWizardStep1 } from 'library/api/frameWizard'

import './OrderStepParameters.style.less'

export interface OrderStepParametersProps {
  wizardType?: FrameWizardType
  bankId?: number
  orderId?: number
  offerStatus?: BankOfferStatus
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOfferStatus: (step: BankOfferStatus) => void
}

const OrderStepParameters: React.FC<OrderStepParametersProps> = ({
  wizardType = FrameWizardType.Full,
  bankId,
  orderId,
  offerStatus,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
  setOfferStatus,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)

  const [ stepData, setStepData ] = useState<FrameWizardStep1Response>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ isAccepted, setAccepted ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (offerStatus) {
      setAccepted(offerStatus === BankOfferStatus.Completed)
    }
  }, [ offerStatus ])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      type: wizardType,
      step: sequenceStepNumber,
      orderId,
      bankId,
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
      bankId,
      orderId,
    }, {})
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setOfferStatus(BankOfferStatus.BankViewed)
      setCurrentStep(sequenceStepNumber + 1)
    }
    setSubmitting(false)
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const renderActions = () => (
    <Row className="WizardStep__actions">
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
            companyHead={stepData?.clientCompanyChief}
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
    <Div className="WizardStep__content">
      {renderStepContent()}
      {!isAccepted && renderActions()}
    </Div>
  )
}

export default OrderStepParameters
