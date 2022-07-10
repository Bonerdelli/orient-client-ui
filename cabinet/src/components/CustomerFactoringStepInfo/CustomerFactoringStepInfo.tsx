import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, message, Row, Skeleton } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import ClientInfo from 'orient-ui-library/components/ClientInfo'
import { FactoringStatus } from 'orient-ui-library/library/models/order'

import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { getFactoringWizardStep, sendFactoringWizardStep } from 'library/api/factoringWizard'
import { CabinetMode } from 'library/models/cabinet'

import './CustomerFactoringStepInfo.style.less'

export interface CustomerFactoringStepInfoProps {
  companyId: number
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  orderStatus?: FactoringStatus
  completed?: boolean,
}

const CustomerFactoringStepInfo: React.FC<CustomerFactoringStepInfoProps> = ({
  companyId,
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
  completed,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)

  const [ stepData, setStepData ] = useState<any>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  const loadCurrentStepData = async () => {
    const result = await getFactoringWizardStep({
      mode: CabinetMode.Customer,
      step: sequenceStepNumber,
      companyId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<any>).data)
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
      mode: CabinetMode.Customer,
      step: sequenceStepNumber,
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

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      sendNextStep()
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
      {t('common.actions.next.title')}
    </Button>
  )

  const renderStepContent = () => (
    <Div className="CustomerFactoringStepInfo">
      <Row gutter={12}>
        <Col lg={12}>
          <ClientInfo
            company={stepData?.clientCompany}
            companyHead={stepData?.clientCompanyFounder}
            companyRequisites={stepData?.clientCompanyRequisites}
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
      {!completed && renderActions()}
    </Div>
  )
}

export default CustomerFactoringStepInfo
