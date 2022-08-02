import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Grid, Skeleton, Steps } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import OfferStatusTag from 'components/OfferStatusTag'
import OrderStepParameters from 'components/OrderStepParameters'
import OrderStepDocuments from 'components/OrderStepDocuments'
import OrderStepContractParams from 'components/OrderStepContractParams'
import OrderStepContractDocuments from 'components/OrderStepContractDocuments'
import OrderStepOfferAcceptance from 'components/OrderStepOfferAcceptance'
import OrderStepArchive from 'components/OrderStepArchive'

import { OrderWizardType } from 'library/models'
import { getFrameOrderWizard, setAssignedUserForFrameOrder } from 'library/api/frameOrder'
import { sendFrameWizardStep } from 'library/api/frameWizard'
import { useStoreState } from 'library/store'

import './FrameBankWizard.style.less'
import { AssignedUserDto } from 'orient-ui-library/library'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FrameBankWizardProps {
  orderId?: number
  backUrl?: string
}

export interface FrameBankWizardPathParams {
  itemId?: string,
}

const FrameBankWizard: React.FC<FrameBankWizardProps> = ({ orderId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const bankId = useStoreState(state => state.bank.bankId)
  const currentUserId = useStoreState(state => state.user.current.userId)
  const { itemId } = useParams<FrameBankWizardPathParams>()

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ offerStatus, setOfferStatus ] = useState<BankOfferStatus>()
  const [ username, setUsername ] = useState<string | undefined>()
  const [ isCurrentUserAssigned, setIsCurrentUserAssigned ] = useState<boolean>(false)

  useEffect(() => {
    if (bankId) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [ bankId ])

  useEffect(() => {
    if (currentStep > 5 && (
      offerStatus === BankOfferStatus.CustomerSign
    )) {
      // NOTE: show waiting for customer sign message
      setSelectedStep(5)
      setCurrentStep(5)
    }
    if (currentStep === 5 && (
      offerStatus === BankOfferStatus.Completed
    )) {
      // NOTE: workaround to show completed step
      sendToArchive()
    }
  }, [ currentStep, offerStatus ])

  // NOTE: workaround to show completed step
  const sendToArchive = async () => {
    await sendFrameWizardStep({
      bankId: bankId as number,
      orderId: Number(itemId) || orderId as number,
      step: 5,
    }, undefined)
    setSelectedStep(6)
    setCurrentStep(6)
  }

  const loadCurrentStepData = async () => {
    const result = await getFrameOrderWizard({
      orderId: Number(itemId) || orderId as number,
      bankId: bankId as number,
    })
    if (result.success) {
      setCurrentStepData((result.data as any).data)
      const step = Number((result.data as any).step)
      let offerStatus = (result.data as any).offerStatus
      setOfferStatus(offerStatus)
      setCurrentStep(step)
      setSelectedStep(step)

      // replace with (result.data as any).assignedUserData after BE support
      const assignedUser: AssignedUserDto = (result.data as any).data?.assignedUserData
      if (assignedUser) {
        if (assignedUser.userLogin) {
          setUsername(assignedUser.userLogin)
        }
        setIsCurrentUserAssigned(assignedUser.userId === currentUserId)
      }

      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const assignCurrentUser = async () => {
    const result = await setAssignedUserForFrameOrder({
      orderId: Number(itemId) || orderId as number,
      bankId: bankId as number,
    })
    if (result.success) {
      // TODO: think about updating view w/o fetching step info
      return loadCurrentStepData()
    }
  }

  const isFirstStepActive = (): boolean => true
  const isSecondStepActive = (): boolean => currentStep > 1
  const isThirdStepActive = (): boolean => currentStep > 2
  const isFourthStepActive = (): boolean => currentStep > 3
  const isFifthStepActive = (): boolean => currentStep > 4
  const isSixthStepActive = (): boolean => currentStep > 5

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
      oprderType: OrderWizardType.Frame,
      currentStep: currentStep,
      setCurrentStep: handleStepChange,
      setOfferStatus,
      offerStatus,
      isCurrentUserAssigned,
      assignCurrentUser,
    }
    switch (selectedStep) {
      case 1:
        return <OrderStepParameters {...stepBaseProps} sequenceStepNumber={1}/>
      case 2:
        return <OrderStepDocuments {...stepBaseProps} sequenceStepNumber={2}/>
      case 3:
        return <OrderStepContractParams {...stepBaseProps} sequenceStepNumber={3}/>
      case 4:
        return <OrderStepContractDocuments {...stepBaseProps} sequenceStepNumber={4}/>
      case 5:
        return <OrderStepOfferAcceptance {...stepBaseProps} sequenceStepNumber={5}/>
      case 6:
        return <OrderStepArchive {...stepBaseProps} sequenceStepNumber={6}/>
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
          title={t('frameWizard.title')}
          backUrl={backUrl}
          username={username}
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
          <Step disabled={!isFirstStepActive()} title={t('frameWizard.firstStep.title')}/>
          <Step disabled={!isSecondStepActive()} title={t('frameWizard.secondStep.title')}/>
          <Step disabled={!isThirdStepActive()} title={t('frameWizard.thirdStep.title')}/>
          <Step disabled={!isFourthStepActive()} title={t('frameWizard.fourthStep.title')}/>
          <Step disabled={!isFifthStepActive()} title={t('frameWizard.fifthStep.title')}/>
          <Step disabled={!isSixthStepActive()} title={t('frameWizard.sixthStep.title')}/>
        </Steps>
      </Card>
      <Card className="FrameWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameBankWizard
