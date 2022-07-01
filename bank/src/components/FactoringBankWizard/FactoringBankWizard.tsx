import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Steps, Grid, Skeleton } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import OfferStatusTag from 'components/OfferStatusTag'
import OrderStepParameters from 'components/OrderStepParameters'
import OrderStepDocuments from 'components/OrderStepDocuments'
import OrderStepArchive from 'components/OrderStepArchive'

import { OrderWizardType } from 'library/models'

import { getFactoringOrderWizard } from 'library/api/factoringOrder'
import { MOCK_BANK_ID } from 'library/mock/bank'

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

const FactoringBankWizard: React.FC<FactoringBankWizardProps> = ({ orderId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FactoringBankWizardPathParams>()

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ orderStatus, setOrderStatus ] = useState<BankOfferStatus>()
  const [ bankId, setBankId ] = useState<number>()

  useEffect(() => {
    if (bankId) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [bankId])

  useEffect(() => {
    if (currentStep === 4 && (
        orderStatus === BankOfferStatus.CustomerSign
    )) {
      // NOTE: show waiting for customer sign message
      setSelectedStep(5)
      setCurrentStep(5)
    }
  }, [currentStep, orderStatus])

  useEffect(() => {
    // TODO: load bank from be (when ready)
    setBankId(MOCK_BANK_ID)
  }, [])

  const loadCurrentStepData = async () => {
    const result = await getFactoringOrderWizard({
      orderId: Number(itemId) || orderId as number,
      bankId: MOCK_BANK_ID,
    })
    if (result.success) {
      setCurrentStepData((result.data as any).data)
      const step = Number((result.data as any).step)
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

  const isFirstStepActive = (): boolean => true
  const isSecondStepActive = (): boolean => currentStep > 1
  const isThirdStepActive = (): boolean => currentStep > 2

  const renderCurrentStep = () => {
    if (!bankId || stepDataLoading) {
      return <Skeleton active={true} />
    }
    const stepBaseProps = {
      bankId: MOCK_BANK_ID,
      orderId: Number(itemId) || orderId,
      oprderType: OrderWizardType.Factoring,
      currentStep: currentStep,
      setCurrentStep: setSelectedStep,
    }
    switch (selectedStep) {
      case 1:
        return <OrderStepParameters {...stepBaseProps} sequenceStepNumber={1} />
      case 2:
        return <OrderStepDocuments {...stepBaseProps} sequenceStepNumber={2} />
      case 3:
        return <OrderStepArchive {...stepBaseProps} sequenceStepNumber={3} />
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
          <Step disabled={!isFirstStepActive()} title={t('factoringWizard.firstStep.title')} />
          <Step disabled={!isSecondStepActive()} title={t('factoringWizard.secondStep.title')} />
          <Step disabled={!isThirdStepActive()} title={t('factoringWizard.thirdStep.title')} />
        </Steps>
      </Card>
      <Card className="FrameWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FactoringBankWizard