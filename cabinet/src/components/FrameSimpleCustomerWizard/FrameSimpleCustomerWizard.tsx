import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Steps, Grid, Skeleton } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderStatus } from 'orient-ui-library/library/models'

import OrderStatusTag from 'components/OrderStatusTag'
import CustomerOrderStepInfo from 'components/CustomerOrderStepInfo'
import CustomerOrderSignDocuments from 'components/CustomerOrderSignDocuments'

import { CabinetMode } from 'library/models/cabinet'
import { getCurrentFrameWizardStep } from 'library/api'

import './FrameSimpleCustomerWizard.style.less'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FrameSimpleCustomerWizardProps {
  companyId: number
  backUrl?: string
}

export interface FrameSimpleCustomerWizardPathParams {
  itemId?: string,
}

const FrameSimpleCustomerWizard: React.FC<FrameSimpleCustomerWizardProps> = ({ companyId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FrameSimpleCustomerWizardPathParams>()

  const [ selectedStep, setSelectedStep ] = useState<number>(1)
  const [ currentStep, setCurrentStep ] = useState<number>(1)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ orderStatus, setOrderStatus ] = useState<OrderStatus>()

  useEffect(() => {
    if (companyId && Number(itemId)) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [companyId])

  const loadCurrentStepData = async () => {
    const result = await getCurrentFrameWizardStep({
      mode: CabinetMode.Customer,
      type: FrameWizardType.Simple,
      companyId: companyId as number,
      orderId: Number(itemId),
    })
    if (result.success) {
      setCurrentStepData((result.data as any).data)
      let step = Number((result.data as any).step)
      let orderStatus = (result.data as any).orderStatus
      setOrderStatus(orderStatus)
      setCurrentStep(step)
      setSelectedStep(step)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const handleStepChange = (step: number) => {
    setSelectedStep(step)
    if (currentStep < step) {
      setCurrentStep(step)
    }
  }

  const renderCurrentStep = () => {
    if (!companyId || stepDataLoading) {
      return <Skeleton active={true} />
    }
    switch (selectedStep) {
      case 1:
        return <CustomerOrderStepInfo
          wizardType={FrameWizardType.Simple}
          companyId={companyId}
          orderId={Number(itemId)}
          currentStep={currentStep}
          setCurrentStep={handleStepChange}
          sequenceStepNumber={1}
        />
      case 2:
        return <CustomerOrderSignDocuments
          wizardType={FrameWizardType.Simple}
          companyId={companyId}
          currentStep={currentStep}
          orderStatus={orderStatus}
          sequenceStepNumber={2}
          setOrderStatus={setOrderStatus}
          setCurrentStep={handleStepChange}
          orderId={Number(itemId)}
        />
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
      <Card className="Wizard FrameSimpleCustomerWizard">
        <WizardHeader
          title={t('frameSimpleOrder.title')}
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
          <Step title={t('customerFrameOrder.firstStep.title')} />
          <Step disabled={currentStep < 2} title={t('customerFrameOrder.secondStep.title')} />
        </Steps>
      </Card>
      <Card className="Wizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameSimpleCustomerWizard
