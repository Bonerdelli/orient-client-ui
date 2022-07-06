import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, message, Row, Skeleton } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import ClientInfo from 'orient-ui-library/components/ClientInfo'
import OrderInfo from 'orient-ui-library/components/OrderInfo'

import { FactoringStatus } from 'orient-ui-library/library/models/order'
import { getFactoringWizardStep, sendFactoringWizardStep } from 'library/api/factoringWizard'

import './FactoringStepParameters.style.less'
import { OperatorFactoringStep1Dto, OperatorFactoringWizardStep1ResponseDto } from 'library/models/factoringWizard'

export interface FactoringStepParametersProps {
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: FactoringStatus) => void
}

const FactoringStepParameters: React.FC<FactoringStepParametersProps> = ({
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
  setOrderStatus,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)

  const [ stepData, setStepData ] = useState<OperatorFactoringStep1Dto>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  const loadCurrentStepData = async () => {
    const result = await getFactoringWizardStep({
      step: sequenceStepNumber,
      orderId: orderId,
    })
    if (result.success) {
      setStepData((result.data as OperatorFactoringWizardStep1ResponseDto).data)
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
    const result = await sendFactoringWizardStep({
      step: sequenceStepNumber,
      orderId: orderId,
    }, {})
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setOrderStatus(FactoringStatus.FACTOR_OPERATOR_VERIFY)
      setCurrentStep(sequenceStepNumber + 1)
    }
    setSubmitting(false)
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      if (currentStep === sequenceStepNumber) {
        sendNextStep()
      } else {
        setCurrentStep(sequenceStepNumber + 1)
      }
    }
  }

  const renderActions = () => (
    <Row className="FactoringWizard__step__actions">
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
    <Div className="FactoringStepParameters">
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
            factoring={stepData?.factorOrder}
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
    <Div className="FactoringWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default FactoringStepParameters
