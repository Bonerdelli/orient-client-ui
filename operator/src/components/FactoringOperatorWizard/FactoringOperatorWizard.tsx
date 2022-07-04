import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Steps, Grid, Skeleton } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { OrderStatus } from 'orient-ui-library/library/models/order'

import OrderStatusTag from 'components/OrderStatusTag'
import FactoringStepParameters from 'components/FactoringStepParameters'
import FactoringStepDocuments from 'components/FactoringStepDocuments'
import FactoringStepStopFactors from 'components/FactoringStepStopFactors'
import FactoringStepSendToBank from 'components/FactoringStepSendToBank'

import { getFactoringOrderWizard } from 'library/api/factoring'

import './FactoringOperatorWizard.style.less'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FactoringOperatorWizardProps {
  orderId?: number
  backUrl?: string
}

export interface FactoringOperatorWizardPathParams {
  itemId?: string,
}

const FactoringOperatorWizard: React.FC<FactoringOperatorWizardProps> = ({ orderId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FactoringOperatorWizardPathParams>()

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ orderStatus, setOrderStatus ] = useState<OrderStatus>()

  useEffect(() => {
    setStepDataLoading(true)
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (selectedStep !== currentStep) {
      setSelectedStep(currentStep)
    }
  }, [currentStep])

  const loadCurrentStepData = async () => {
    const result = await getFactoringOrderWizard({
      orderId: Number(itemId) || orderId as number,
    })
    if (result.success) {
      const step = Number((result.data as any).step)
      const orderStatus = (result.data as any).orderStatus
      setOrderStatus(orderStatus)
      setCurrentStep(step)
      setSelectedStep(step)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const isFirstStepActive = (): boolean => true
  const isSecondStepActive = (): boolean => currentStep > 1
  const isThirdStepActive = (): boolean => currentStep > 2
  const isFourthStepActive = (): boolean => currentStep > 3

  const renderCurrentStep = () => {
    if (stepDataLoading) {
      return <Skeleton active={true} />
    }
    const stepBaseProps = {
      orderId: Number(itemId) || orderId,
      currentStep: currentStep,
      setCurrentStep: setCurrentStep,
    }
    switch (selectedStep) {
      case 1:
        return <FactoringStepParameters {...stepBaseProps} sequenceStepNumber={1}/>
      case 2:
        return <FactoringStepDocuments {...stepBaseProps} sequenceStepNumber={2}/>
      case 3:
        return <FactoringStepStopFactors {...stepBaseProps} sequenceStepNumber={3}/>
      case 4:
        return <FactoringStepSendToBank {...stepBaseProps} sequenceStepNumber={4}/>
      default:
        return <></>
    }
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning" />
    )
  }

  return (
    <>
      <Card className="Wizard FactoringOperatorWizard">
        <WizardHeader
          title={t('frameWizard.title')}
          backUrl={backUrl}
          statusTag={
            <OrderStatusTag
              statusCode={orderStatus}
              refreshAction={() => loadCurrentStepData()}
            />
          }
        />
        <Steps
          current={stepDataLoading ? undefined : selectedStep - 1}
          direction={breakpoint.xl ? 'horizontal' : 'vertical'}
          onChange={(step) => setSelectedStep(step + 1)}
        >
          <Step disabled={!isFirstStepActive()} title={t('frameWizard.firstStep.title')} />
          <Step disabled={!isSecondStepActive()} title={t('frameWizard.secondStep.title')} />
          <Step disabled={!isThirdStepActive()} title={t('frameWizard.thirdStep.title')} />
          <Step disabled={!isFourthStepActive()} title={t('frameWizard.fifthStep.title')} />
        </Steps>
      </Card>
      <Card className="FactoringOperatorWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FactoringOperatorWizard
