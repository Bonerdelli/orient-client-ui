import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Grid, Skeleton, Steps } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FactoringStatus } from 'orient-ui-library/library/models'

import OrderStatusTag from 'components/OrderStatusTag'
import FactoringStepParameters from 'components/FactoringStepParameters'
import FactoringStepDocuments from 'components/FactoringStepDocuments'
import FactoringStepSignDocuments from 'components/FactoringStepSignDocuments'
import FactoringStepBankOffers from 'components/FactoringStepBankOffers'

import { useStoreState } from 'library/store'

import { getCurrentFactoringWizardStep } from 'library/api'

import './FactoringClientWizard.style.less'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FactoringClientWizardProps {
  // orderId?: number
  backUrl?: string
}

export interface FactoringClientWizardPathParams {
  itemId?: string,
}

const FactoringClientWizard: React.FC<FactoringClientWizardProps> = ({ backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FactoringClientWizardPathParams>()
  const dicts = useStoreState(state => state.dictionary.list)
  const companyId = useStoreState(state => state.company.companyId)

  const [ selectedStep, setSelectedStep ] = useState<number>(1)
  const [ currentStep, setCurrentStep ] = useState<number>(1)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ orderId, _setOrderId ] = useState<number>()
  const [ orderStatus, setOrderStatus ] = useState<FactoringStatus>()

  useEffect(() => {
    if (companyId && (Number(itemId) || orderId)) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [ companyId ])

  const loadCurrentStepData = async () => {
    const result = await getCurrentFactoringWizardStep({
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
      return <Skeleton active={true}/>
    }
    switch (selectedStep) {
      case 1:
        return <FactoringStepParameters
          companyId={companyId}
          factoringOrderId={Number(itemId) || orderId}
          currentStep={currentStep}
          setCurrentStep={handleStepChange}
          sequenceStepNumber={1}
          dictionaries={dicts}
        />
      case 2:
        return <FactoringStepDocuments
          companyId={companyId}
          currentStep={currentStep}
          sequenceStepNumber={2}
          setCurrentStep={handleStepChange}
          setOrderStatus={setOrderStatus}
          orderId={Number(itemId) || orderId}
        />
      case 3:
        return <FactoringStepSignDocuments
          companyId={companyId}
          currentStep={currentStep}
          sequenceStepNumber={3}
          setCurrentStep={handleStepChange}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          orderId={Number(itemId) || orderId}
        />
      case 4:
        return <FactoringStepBankOffers
          companyId={companyId as number}
          currentStep={currentStep}
          sequenceStepNumber={4}
          setOrderStatus={setOrderStatus}
          setCurrentStep={handleStepChange}
          orderId={Number(itemId) || orderId}
          orderStatus={orderStatus}
        />
      default:
        return <></>
    }
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning"/>
    )
  }

  return (
    <>
      <Card className="Wizard FactoringClientWizard">
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
          <Step title={t('factoring.firstStep.title')}/>
          <Step disabled={currentStep < 2} title={t('factoring.secondStep.title')}/>
          <Step disabled={currentStep < 3} title={t('factoring.thirdStep.title')}/>
          <Step disabled={currentStep < 4} title={t('factoring.fourthStep.title')}/>
        </Steps>
      </Card>
      <Card className="Wizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FactoringClientWizard
