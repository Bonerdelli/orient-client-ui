import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Steps, Grid, Skeleton } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderStatus } from 'orient-ui-library/library/models'

import OrderStatusTag from 'components/OrderStatusTag'
import CustomerFactoringStepInfo from 'components/CustomerFactoringStepInfo'
import CustomerFactoringSignDocuments from 'components/CustomerFactoringSignDocuments'

import { CabinetMode } from 'library/models/cabinet'
import { getCurrentFrameWizardStep } from 'library/api'

import './FactoringCustomerWizard.style.less'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FactoringCustomerWizardProps {
  companyId: number
  backUrl?: string
}

export interface FactoringCustomerWizardPathParams {
  itemId?: string,
}

const FactoringCustomerWizard: React.FC<FactoringCustomerWizardProps> = ({ companyId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FactoringCustomerWizardPathParams>()

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
      type: FrameWizardType.Full,
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

  const renderCurrentStep = () => {
    if (!companyId || stepDataLoading) {
      return <Skeleton active={true} />
    }
    switch (selectedStep) {
      case 1:
        return <CustomerFactoringStepInfo
          companyId={companyId}
          orderId={Number(itemId)}
          currentStep={currentStep}
          setCurrentStep={setSelectedStep}
          sequenceStepNumber={1}
        />
      case 2:
        return <CustomerFactoringSignDocuments
          companyId={companyId}
          currentStep={currentStep}
          sequenceStepNumber={2}
          setCurrentStep={setSelectedStep}
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
      <Card className="Wizard FactoringCustomerWizard">
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

export default FactoringCustomerWizard
