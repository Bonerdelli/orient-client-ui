import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Grid, Skeleton, Steps } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FactoringStatus } from 'orient-ui-library/library/models/order'

import OfferStatusTag from 'components/OfferStatusTag'
import FactoringStepParameters from 'components/FactoringStepParameters'
import FactoringStepDocuments from 'components/FactoringStepDocuments'
import FactoringStepArchive from 'components/FactoringStepArchive'

import { OrderWizardType } from 'library/models'

import { useStoreState } from 'library/store'
import { getFactoringOrderWizard } from 'library/api/factoringOrder'

import './FactoringBankWizard.style.less'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FactoringBankWizardProps {
  orderId?: number
  backUrl?: string
}

export interface FactoringBankWizardPathParams {
  itemId?: string,
}

const FACTORING_BANK_COMPLETED_STATUSES = [
  FactoringStatus.FACTOR_COMPLETED,
  FactoringStatus.FACTOR_CANCEL,
  FactoringStatus.FACTOR_CHARGED,
  FactoringStatus.FACTOR_OPERATOR_REJECT,
]

const FactoringBankWizard: React.FC<FactoringBankWizardProps> = ({ orderId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const bankId = useStoreState(state => state.bank.bankId)
  const { itemId } = useParams<FactoringBankWizardPathParams>()

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()

  const [ orderStatus, setOrderStatus ] = useState<FactoringStatus>()
  const [ completed, setCompleted ] = useState<boolean>()

  useEffect(() => {
    if (bankId) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [ bankId ])

  useEffect(() => {
    if (orderStatus && FACTORING_BANK_COMPLETED_STATUSES.includes(orderStatus)) {
      setCompleted(true)
    }
  }, [ orderStatus ])

  const loadCurrentStepData = async () => {
    const result = await getFactoringOrderWizard({
      orderId: Number(itemId) || orderId as number,
      bankId: bankId as number,
    })
    if (result.success) {
      const step = Number((result.data as any).step)
      let orderStatus = (result.data as any).orderStatus
      setOrderStatus(orderStatus)
      setSelectedStep(step > 3 ? 3 : step) // NOTE: workaround to handle 'invisible' steps
      setCurrentStep(step)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const isFirstStepActive = (): boolean => true
  const isSecondStepActive = (): boolean => currentStep > 1
  const isThirdStepActive = (): boolean => currentStep > 2

  const handleStepChange = (step: number) => {
    setSelectedStep(step)
    if (currentStep < step) {
      setCurrentStep(step)
    }
  }

  const renderCurrentStep = () => {
    if (!bankId || stepDataLoading) {
      return <Skeleton active={true}/>
    }
    const stepBaseProps = {
      bankId: bankId as number,
      orderId: Number(itemId) || orderId,
      oprderType: OrderWizardType.Factoring,
      setCurrentStep: handleStepChange,
      setOrderStatus,
      currentStep,
      completed,
    }
    switch (selectedStep) {
      case 1:
        return <FactoringStepParameters {...stepBaseProps} sequenceStepNumber={1}/>
      case 2:
        return <FactoringStepDocuments {...stepBaseProps} sequenceStepNumber={2}/>
      case 3:
        return <FactoringStepArchive {...stepBaseProps} sequenceStepNumber={3}/>
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
      <Card className="Wizard FrameWizard">
        <WizardHeader
          title={t('factoringWizard.title')}
          backUrl={backUrl}
          statusTag={
            <OfferStatusTag
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
          <Step disabled={!isFirstStepActive()} title={t('factoringWizard.firstStep.title')}/>
          <Step disabled={!isSecondStepActive()} title={t('factoringWizard.secondStep.title')}/>
          <Step disabled={!isThirdStepActive()} title={t('factoringWizard.thirdStep.title')}/>
        </Steps>
      </Card>
      <Card className="FrameWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FactoringBankWizard
