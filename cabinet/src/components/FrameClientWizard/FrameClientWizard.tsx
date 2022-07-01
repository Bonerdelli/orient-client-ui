import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Steps, Grid, Skeleton } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderStatus } from 'orient-ui-library/library/models'

import OrderStatusTag from 'components/OrderStatusTag'
import OrderStepSelectInn from 'components/OrderStepSelectInn'
import OrderStepDocuments from 'components/OrderStepDocuments'
import OrderStepSignDocuments from 'components/OrderStepSignDocuments'
import OrderStepBankOffers from 'components/OrderStepBankOffers'

import { Customer } from 'library/models'
import { useStoreState } from 'library/store'

import { getCurrentFrameWizardStep } from 'library/api'

import './FrameClientWizard.style.less'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FrameClientWizardProps {
  // orderId?: number
  companyId: number
  backUrl?: string
}

export interface FrameClientWizardPathParams {
  itemId?: string,
}

const FrameClientWizard: React.FC<FrameClientWizardProps> = ({ companyId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FrameClientWizardPathParams>()
  const company = useStoreState(state => state.company.current)

  const [ selectedStep, setSelectedStep ] = useState<number>(1)
  const [ currentStep, setCurrentStep ] = useState<number>(1)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ orderId, setOrderId ] = useState<number>()
  const [ orderStatus, setOrderStatus ] = useState<OrderStatus>()

  // TODO: BE doesn't sent customer, fix after DE fixes
  const [ selectedCustomer, setSelectedCustomer ] = useState<Customer>()

  useEffect(() => {
    if (companyId && (Number(itemId) || orderId)) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [companyId])

  useEffect(() => {
    if (currentStep === 2 && (
        orderStatus === OrderStatus.FRAME_OPERATOR_VERIFYING ||
        orderStatus === OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY
    )) {
      // NOTE: show waiting for verify message
      setSelectedStep(3)
      setCurrentStep(3)
    }
  }, [currentStep, orderStatus])

  const loadCurrentStepData = async () => {
    const result = await getCurrentFrameWizardStep({
      type: FrameWizardType.Full,
      companyId: companyId as number,
      orderId: Number(itemId) || orderId,
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

  const renderCurrentStep = () => {
    if (!companyId || stepDataLoading) {
      return <Skeleton active={true} />
    }
    switch (selectedStep) {
      case 1:
        return <OrderStepSelectInn
          companyId={companyId}
          orderId={Number(itemId) || orderId}
          setOrderId={setOrderId}
          currentStep={currentStep}
          setCurrentStep={setSelectedStep}
          sequenceStepNumber={1}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
      case 2:
        return <OrderStepDocuments
          companyId={companyId}
          currentStep={currentStep}
          sequenceStepNumber={2}
          setCurrentStep={setSelectedStep}
          setOrderStatus={setOrderStatus}
          orderId={Number(itemId) || orderId}
        />
      case 3:
        return <OrderStepSignDocuments
          companyId={companyId}
          currentStep={currentStep}
          sequenceStepNumber={3}
          setCurrentStep={setSelectedStep}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          orderId={Number(itemId) || orderId}
          customerId={selectedCustomer?.id}
        />
      case 4:
        return <OrderStepBankOffers
          companyId={company?.id as number}
          currentStep={currentStep}
          sequenceStepNumber={4}
          setOrderStatus={setOrderStatus}
          setCurrentStep={setSelectedStep}
          orderId={Number(itemId) || orderId}
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
      <Card className="Wizard FrameClientWizard">
        <WizardHeader
          title={t('frameOrder.title')}
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
          <Step title={t('frameOrder.firstStep.title')} />
          <Step disabled={!selectedCustomer && !currentStep} title={t('frameOrder.secondStep.title')} />
          <Step disabled={currentStep < 3} title={t('frameOrder.thirdStep.title')} />
          <Step disabled={currentStep < 4} title={t('frameOrder.fourthStep.title')} />
        </Steps>
      </Card>
      <Card className="Wizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameClientWizard
