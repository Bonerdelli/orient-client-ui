import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Steps, Grid, Skeleton } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FactoringStatus } from 'orient-ui-library/library/models/order'

import OrderStatusTag from 'components/OrderStatusTag'
import CustomerFactoringStepInfo from 'components/CustomerFactoringStepInfo'
import CustomerFactoringSignDocuments from 'components/CustomerFactoringSignDocuments'

import { CabinetMode } from 'library/models/cabinet'
import { getCurrentFactoringWizardStep } from 'library/api/factoringWizard'

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

export const FACTORING_CUSTOMER_COMPLETED_STATUSES = [
  FactoringStatus.FACTOR_COMPLETED,
  FactoringStatus.FACTOR_CANCEL,
  FactoringStatus.FACTOR_CHARGED,
  FactoringStatus.FACTOR_OPERATOR_REJECT,
  FactoringStatus.FACTOR_WAIT_FOR_CHARGE,
]

const FactoringCustomerWizard: React.FC<FactoringCustomerWizardProps> = ({
  companyId,
  backUrl,
}) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FactoringCustomerWizardPathParams>()

  const [ selectedStep, setSelectedStep ] = useState<number>(1)
  const [ currentStep, setCurrentStep ] = useState<number>(1)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ orderStatus, setOrderStatus ] = useState<FactoringStatus>()
  const [ completed, setCompleted ] = useState<boolean>(false)

  useEffect(() => {
    if (companyId && Number(itemId)) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [companyId])

  useEffect(() => {
    if (orderStatus && FACTORING_CUSTOMER_COMPLETED_STATUSES.includes(orderStatus)) {
      setCompleted(true)
    }
  }, [orderStatus])

  const loadCurrentStepData = async () => {
    const result = await getCurrentFactoringWizardStep({
      mode: CabinetMode.Customer,
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
        return <CustomerFactoringStepInfo
          companyId={companyId}
          orderId={Number(itemId)}
          currentStep={currentStep}
          orderStatus={orderStatus}
          setCurrentStep={handleStepChange}
          sequenceStepNumber={1}
          completed={completed}
        />
      case 2:
        return <CustomerFactoringSignDocuments
          companyId={companyId}
          currentStep={currentStep}
          orderStatus={orderStatus}
          sequenceStepNumber={2}
          setOrderStatus={setOrderStatus}
          setCurrentStep={handleStepChange}
          orderId={Number(itemId)}
          completed={completed}
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
          title={t('factoring.title')}
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
