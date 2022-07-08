import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Steps, Grid, Skeleton } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

import OfferStatusTag from 'components/OfferStatusTag'
import OrderStepParameters from 'components/OrderStepParameters'
import OrderStepDocuments from 'components/OrderStepDocuments'
import OrderStepCustomerSign from 'components/OrderStepCustomerSign'
import OrderStepArchive from 'components/OrderStepArchive'

import { OrderWizardType } from 'library/models'

import { getCurrentFrameWizardStep, sendFrameWizardStep } from 'library/api/frameWizard'
import { MOCK_BANK_ID } from 'library/mock/bank'

import './FrameSimpleBankWizard.style.less'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FrameSimpleBankWizardProps {
  orderId?: number
  backUrl?: string
}

export interface FrameSimpleBankWizardPathParams {
  itemId?: string,
}

const FrameSimpleBankWizard: React.FC<FrameSimpleBankWizardProps> = ({ orderId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FrameSimpleBankWizardPathParams>()

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ offerStatus, setOfferStatus ] = useState<BankOfferStatus>()
  const [ bankId, setBankId ] = useState<number>()

  useEffect(() => {
    if (bankId) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [bankId])

  useEffect(() => {
    if (currentStep === 3 && (
        offerStatus === BankOfferStatus.Completed
    )) {
      // NOTE: workaround to show completed step
      sendToArchive()
    }
  }, [currentStep, offerStatus])

  useEffect(() => {
    // TODO: load bank from be (when ready)
    setBankId(MOCK_BANK_ID)
  }, [])

  // NOTE: workaround to show completed step
  const sendToArchive = async () => {
    await sendFrameWizardStep({
      type: FrameWizardType.Simple,
      orderId: Number(itemId) || orderId as number,
      step: 3,
      bankId,
    }, undefined)
    setSelectedStep(4)
    setCurrentStep(4)
  }

  const loadCurrentStepData = async () => {
    const result = await getCurrentFrameWizardStep({
      type: FrameWizardType.Simple,
      orderId: Number(itemId) || orderId as number,
      bankId: MOCK_BANK_ID,
    })
    if (result.success) {
      setCurrentStepData((result.data as any).data)
      const step = Number((result.data as any).step)
      let offerStatus = (result.data as any).offerStatus
      setOfferStatus(offerStatus)
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

  const handleStepChange = (step: number) => {
    setSelectedStep(step)
    if (currentStep < step) {
      setCurrentStep(step)
    }
  }


  const renderCurrentStep = () => {
    if (!bankId || stepDataLoading) {
      return <Skeleton active={true} />
    }
    const stepBaseProps = {
      bankId: MOCK_BANK_ID,
      orderId: Number(itemId) || orderId,
      wizardType: FrameWizardType.Simple,
      oprderType: OrderWizardType.Frame,
      currentStep: currentStep,
      setCurrentStep: handleStepChange,
      setOfferStatus,
      offerStatus,
    }
    switch (selectedStep) {
      case 1:
        return <OrderStepParameters {...stepBaseProps} sequenceStepNumber={1} />
      case 2:
        return <OrderStepDocuments {...stepBaseProps} sequenceStepNumber={2} />
      case 3:
        return <OrderStepCustomerSign {...stepBaseProps} sequenceStepNumber={3} />
      case 4:
        return <OrderStepArchive {...stepBaseProps} sequenceStepNumber={4} />
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
          title={t('frameSimpleWizard.title')}
          backUrl={backUrl}
          statusTag={
            <OfferStatusTag
              statusCode={offerStatus}
              refreshAction={() => loadCurrentStepData()}
            />
          }
        />
        <Steps
          current={stepDataLoading ? undefined : selectedStep - 1}
          direction={breakpoint.xl ? 'horizontal' : 'vertical'}
          onChange={(step) => setSelectedStep(step + 1)}
        >
          <Step disabled={!isFirstStepActive()} title={t('frameSimpleWizard.firstStep.title')} />
          <Step disabled={!isSecondStepActive()} title={t('frameSimpleWizard.secondStep.title')} />
          <Step disabled={!isThirdStepActive()} title={t('frameSimpleWizard.thirdStep.title')} />
          <Step disabled={!isFourthStepActive()} title={t('frameSimpleWizard.fourthStep.title')} />
        </Steps>
      </Card>
      <Card className="FrameWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameSimpleBankWizard
