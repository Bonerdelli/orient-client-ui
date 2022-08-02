import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Result, Row, Skeleton } from 'antd'
import { ClockCircleFilled } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'

import { getFrameWizardStep } from 'library/api/frameWizard'

import './OrderStepCustomerSign.style.less'

export interface OrderStepCustomerSignProps {
  bankId?: number | bigint
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepCustomerSign: React.FC<OrderStepCustomerSignProps> = ({
  bankId,
  orderId,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      type: FrameWizardType.Simple,
      step: sequenceStepNumber,
      bankId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<any>).data) // TODO: ask be to generate typings
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(sequenceStepNumber - 1)
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
    >
      {t('common.actions.back.title')}
    </Button>
  )

  const renderStepContent = () => (
    <Result className="OrderStepCustomerSign"
            icon={<ClockCircleFilled/>}
            title={t('Ожидайте подписания')}
    />
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
      {renderActions()}
    </Div>
  )
}

export default OrderStepCustomerSign
