import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, List, message, Row, Skeleton, Typography } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { getFactoringWizardStep, sendFactoringWizardStep } from 'library/api/factoringWizard'

import './FactoringStepSendToBank.style.less'
import { OperatorFactoringStep4Dto, OperatorFactoringWizardStep4ResponseDto } from 'library/models/factoringWizard'
import { StopFactor } from 'library/models/stopFactor'
import { FactoringStatus } from 'orient-ui-library/library'

const { Title } = Typography

export interface FactoringStepSendToBankProps {
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  orderStatus: FactoringStatus
}

const FactoringStepSendToBank: React.FC<FactoringStepSendToBankProps> = ({
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
  orderStatus,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<OperatorFactoringStep4Dto['bank']>()
  const [ failedStopFactors, setFailedStopFactors ] = useState<StopFactor[]>([])
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ completed, setCompleted ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (orderStatus !== FactoringStatus.FACTOR_OPERATOR_VERIFY) {
      setCompleted(true)
    }
  }, [ orderStatus ])

  const loadCurrentStepData = async () => {
    const result = await getFactoringWizardStep({
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      const response = result.data as OperatorFactoringWizardStep4ResponseDto
      setStepData(response.data.bank)
      const failedStopFactors = response.data.bank.stopFactors?.filter(({ isOk }) => !isOk) ?? []
      setFailedStopFactors(failedStopFactors)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
    setNextStepAllowed(true)
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFactoringWizardStep({
      step: sequenceStepNumber,
      orderId,
    }, {})
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      loadCurrentStepData()
      // setCompleted(true)
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

  const renderActions = () => (
    <Row>
      <Col flex={1}>{renderPrevButton()}</Col>
      <Col>{!completed && renderSubmitButton()}</Col>
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
      {t('common.actions.sendInBank.title')}
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

  const renderStopFactors = () => (
    <List
      size="small"
      dataSource={failedStopFactors}
      renderItem={item => <List.Item>{item.stopFactorName}</List.Item>}
    />
  )

  const renderStepContent = () => (
    <Div className="FactoringStepSendToBank">
      <Title level={5}>
        {t(
          `factoringStepSendToBank.title.${completed ? 'sent' : 'readyForSending'}`,
          { bankName: stepData?.bankName ?? '' },
        )}
      </Title>
      {!completed && !!failedStopFactors?.length && renderStopFactors()}
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

export default FactoringStepSendToBank
