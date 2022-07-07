import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Steps, Result, Grid, Skeleton } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderStatus } from 'orient-ui-library/library/models'

import OrderStatusTag from 'components/OrderStatusTag'
import OrderStepSelectInn from 'components/OrderStepSelectInn'
import OrderStepDocuments from 'components/OrderStepDocuments'
import OrderStepSignDocuments from 'components/OrderStepSignDocuments'

import { Customer } from 'library/models'

import { getCurrentFrameWizardStep } from 'library/api'

import './FrameSimpleClientWizard.style.less'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FrameSimpleWizardProps {
  // orderId?: number
  companyId: number
  backUrl?: string
}

export interface FrameSimpleWizardPathParams {
  itemId?: string,
}

const FrameSimpleWizard: React.FC<FrameSimpleWizardProps> = ({ companyId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FrameSimpleWizardPathParams>()

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
      type: FrameWizardType.Simple,
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
    if (currentStep === 4) {
      return <Result
        icon={<CheckCircleFilled />}
        title={t('Заявка отправлена в Банк')}
      />
    }
    switch (selectedStep) {
      case 1:
        return <OrderStepSelectInn
          wizardType={FrameWizardType.Simple}
          companyId={companyId}
          orderId={Number(itemId) || orderId}
          setOrderId={setOrderId}
          currentStep={currentStep}
          setCurrentStep={handleStepChange}
          sequenceStepNumber={1}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
      case 2:
        return <OrderStepDocuments
          wizardType={FrameWizardType.Simple}
          companyId={companyId}
          currentStep={currentStep}
          sequenceStepNumber={2}
          setCurrentStep={handleStepChange}
          setOrderStatus={setOrderStatus}
          orderId={Number(itemId) || orderId}
        />
      case 3:
        return <OrderStepSignDocuments
          wizardType={FrameWizardType.Simple}
          companyId={companyId}
          currentStep={currentStep}
          sequenceStepNumber={3}
          setCurrentStep={handleStepChange}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          customerId={selectedCustomer?.id}
        />
      case 4:
        // NOTE: WIP
        return <Result
          icon={<CheckCircleFilled />}
          title={t('Заявка отправлена в Банк')}
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
      <Card className="Wizard FrameSimpleWizard">
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
          <Step title={t('frameSimpleOrder.firstStep.title')} />
          <Step disabled={!selectedCustomer && !currentStep} title={t('frameSimpleOrder.secondStep.title')} />
          <Step disabled={currentStep < 3} title={t('frameSimpleOrder.thirdStep.title')} />
          <Step disabled={currentStep < 4} title={t('frameSimpleOrder.fourthStep.title')} />
        </Steps>
      </Card>
      <Card className="Wizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameSimpleWizard
