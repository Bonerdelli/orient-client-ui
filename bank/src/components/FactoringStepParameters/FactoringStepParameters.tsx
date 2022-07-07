import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, message, Row, Skeleton } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import ClientInfo from 'orient-ui-library/components/ClientInfo'
import OrderInfo from 'orient-ui-library/components/OrderInfo'

import { BankFactoringWizardStep1Dto } from 'library/models/factoringWizard'
import {
  BankFactoringWizardStep1ResponseDto,
  getFactoringWizardStep,
  sendFactoringWizardStep,
} from 'library/api/factoringWizard'

import './FactoringStepParameters.style.less'

export interface FactoringStepParametersProps {
  bankId?: number
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setSelectedStep: (step: number) => void
  completed?: boolean
}

const FactoringStepParameters: React.FC<FactoringStepParametersProps> = ({
  bankId,
  orderId,
  currentStep,
  setSelectedStep,
  sequenceStepNumber,
  completed,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)

  const [ stepData, setStepData ] = useState<BankFactoringWizardStep1Dto>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  const loadCurrentStepData = async () => {
    const result = await getFactoringWizardStep({
      step: sequenceStepNumber,
      bankId: bankId as number,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as BankFactoringWizardStep1ResponseDto).data)
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
      bankId: bankId as number,
      orderId,
    }, {})
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setSelectedStep(sequenceStepNumber + 1)
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
      onClick={() => setSelectedStep(sequenceStepNumber + 1)}
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

  const renderStepContent = () => {
    let customerCompanyData
    if (stepData) {
      customerCompanyData = {
        inn: stepData?.customerInn,
        shortName: stepData?.customerName,
      }
    }

    return (
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
              customerCompany={customerCompanyData}
              factoring={stepData?.factorOrder}
              conditions={stepData?.conditions}
            />
          </Col>
        </Row>
      </Div>
    )
  }

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
      {!completed && renderActions()}
    </Div>
  )
}

export default FactoringStepParameters
