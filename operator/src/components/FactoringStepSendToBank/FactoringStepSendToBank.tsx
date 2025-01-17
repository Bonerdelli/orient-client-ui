import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, List, message, Result, Row, Skeleton } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { getFactoringWizardStep, sendFactoringWizardStep, factoringOrderReject } from 'library/api/factoringWizard'

import './FactoringStepSendToBank.style.less'
import { OperatorFactoringStep4Dto, OperatorFactoringWizardStep4ResponseDto } from 'library/models/factoringWizard'
import { StopFactor } from 'library/models/stopFactor'
import { FactoringStatus } from 'orient-ui-library/library'

import RejectOrderModal from 'components/RejectOrderModal'
import { FACTORING_REJECTION_ALLOWED_STATUSES } from 'library/models/factoringWizard'

export interface FactoringStepSendToBankProps {
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: FactoringStatus) => void
  orderStatus?: FactoringStatus
  isCurrentUserAssigned: boolean
  assignCurrentUser: () => Promise<unknown>
}

const FactoringStepSendToBank: React.FC<FactoringStepSendToBankProps> = ({
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
  setOrderStatus,
  orderStatus,
  isCurrentUserAssigned,
  assignCurrentUser,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<OperatorFactoringStep4Dto['bank']>()
  const [ failedStopFactors, setFailedStopFactors ] = useState<StopFactor[]>([])
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ bankName, setBankName ] = useState<string>()
  const [ completed, setCompleted ] = useState<boolean>()

  const [ rejectModalOpened, setRejectModalOpened ] = useState<boolean>(false)

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (orderStatus !== FactoringStatus.FACTOR_OPERATOR_VERIFY) {
      setCompleted(true)
      setNextStepAllowed(false)
    }
  }, [ orderStatus ])

  useEffect(() => {
    if (stepData?.bankName) {
      setBankName(stepData.bankName)
    }
  }, [ stepData ])


  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      setNextStepAllowed(false)
    } else {
      setNextStepAllowed(true)
    }
  }, [ currentStep ])

  const loadCurrentStepData = async () => {
    const result = await getFactoringWizardStep({
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      const response = result.data as OperatorFactoringWizardStep4ResponseDto
      setStepData(response.data.bank)
      setOrderStatus((result.data as OperatorFactoringWizardStep4ResponseDto).orderStatus as FactoringStatus)
      const failedStopFactors = response.data.bank.stopFactors?.filter(({ isOk }) => !isOk) ?? []
      setFailedStopFactors(failedStopFactors)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
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
      setOrderStatus(FactoringStatus.FACTOR_CLIENT_SIGN)
      loadCurrentStepData()
      setCompleted(true)
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

  const handleOrderReject = async (code: number, reason: string) => {
    const result = await factoringOrderReject({
      step: sequenceStepNumber,
      orderId: orderId as number,
    }, {
      rejectReasonId: code,
      rejectComment: reason,
    })
    loadCurrentStepData()
    return result.success ?? false
  }

  const handleOrderAssign = async () => {
    setSubmitting(true)
    await assignCurrentUser()
    setSubmitting(false)
  }

  const renderAssignOrderButton = () => (
    <Button
      size="large"
      type="primary"
      disabled={submitting}
      onClick={handleOrderAssign}
    >
      {t('orderActions.assign.title')}
    </Button>
  )

  const renderAssignAction = () => (
    <Row className="WizardStep__actions WizardStep__actions--single">
      <Col>{renderAssignOrderButton()}</Col>
    </Row>
  )

  const rejectAllowed = orderStatus && FACTORING_REJECTION_ALLOWED_STATUSES.includes(orderStatus)

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col>{renderPrevButton()}</Col>
      <Col>{rejectAllowed && renderRejectButton()}</Col>
      <Col flex={1}></Col>
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
    >
      {t('common.actions.back.title')}
    </Button>
  )

  const renderRejectButton = () => {
    return (
      <Button
        danger
        size="large"
        type="default"
        onClick={() => setRejectModalOpened(true)}
      >
        {t('common.actions.reject.title')}
      </Button>
    )
  }

  // TODO: support negative scenarious after DEMO
  const renderStopFactors = () => (
    <List
      size="small"
      dataSource={failedStopFactors}
      renderItem={item => <List.Item>{item.stopFactorName}</List.Item>}
    />
  )

  const renderReadyForSendingContent = () => (
    <Div className="OrderStepSendToBank">
      <Result
        icon={<InfoCircleFilled/>}
        title={t('orderStepSendToBank.readyForSending.title')}
        subTitle={bankName && t(
          'orderStepSendToBank.readyForSending.desc',
          { bankName },
        )}
      />
    </Div>
  )

  const renderOrderSentContent = () => (
    <Div className="OrderStepSendToBank">
      <Result
        status="success"
        title={t('orderStepSendToBank.sent.title')}
        subTitle={bankName && t(
          'orderStepSendToBank.sent.desc',
          { bankName },
        )}
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
    <Div className="WizardStep__content">
      {!completed ? renderReadyForSendingContent() : renderOrderSentContent()}
      {/* !completed && Boolean(failedStopFactors?.length) && renderStopFactors() */}
      {!completed && (isCurrentUserAssigned ? renderActions() : renderAssignAction())}
      {!completed &&
        <RejectOrderModal
          opened={rejectModalOpened}
          setOpened={setRejectModalOpened}
          rejectHandler={handleOrderReject}
        />}
    </Div>
  )
}

export default FactoringStepSendToBank
