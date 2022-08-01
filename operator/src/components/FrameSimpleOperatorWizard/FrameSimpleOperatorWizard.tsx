import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Card, Grid, Skeleton, Steps } from 'antd'

import WizardHeader from 'orient-ui-library/components/WizardHeader'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { OrderStatus } from 'orient-ui-library/library/models/order'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

import OrderStatusTag from 'components/OrderStatusTag'
import OrderStepParameters from 'components/OrderStepParameters'
import OrderStepDocumentsAndConditions from 'components/OrderStepDocumentsAndConditions'
import OrderStepSendToBank from 'components/OrderStepSendToBank'

import { getFrameSimpleOrderWizard, setAssignedUserForFrameSimpleOrder } from 'library/api/frameSimpleOrder'

import './FrameSimpleOperatorWizard.style.less'
import { AssignedUserDto } from 'library/models'
import { useStoreState } from 'library/store'

const { Step } = Steps
const { useBreakpoint } = Grid

export interface FrameSimpleOperatorWizardProps {
  orderId?: number
  backUrl?: string
}

export interface FrameSimpleOperatorWizardPathParams {
  itemId?: string,
}

const FrameSimpleOperatorWizard: React.FC<FrameSimpleOperatorWizardProps> = ({ orderId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FrameSimpleOperatorWizardPathParams>()
  const currentUserId = useStoreState(state => state.user.current.userId)

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ orderStatus, setOrderStatus ] = useState<OrderStatus>()
  const [ username, setUsername ] = useState<string | undefined>()
  const [ isCurrentUserAssigned, setIsCurrentUserAssigned ] = useState<boolean>(false)

  useEffect(() => {
    setStepDataLoading(true)
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (selectedStep !== currentStep) {
      setSelectedStep(currentStep)
    }
  }, [ currentStep ])

  const loadCurrentStepData = async () => {
    const result = await getFrameSimpleOrderWizard({
      orderId: Number(itemId) || orderId as number,
    })
    if (result.success) {
      const step = Number((result.data as any).step)
      const orderStatus = (result.data as any).orderStatus
      setOrderStatus(orderStatus)
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
    const result = await setAssignedUserForFrameSimpleOrder({ orderId: Number(itemId) || orderId as number })
    if (result.success) {
      // TODO: think about updating view w/o fetching step info
      return loadCurrentStepData()
    }
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
    if (stepDataLoading) {
      return <Skeleton active={true}/>
    }
    const stepBaseProps = {
      orderId: Number(itemId) || orderId,
      currentStep: currentStep,
      setCurrentStep: handleStepChange,
      isCurrentUserAssigned,
      assignCurrentUser,
    }
    switch (selectedStep) {
      case 1:
        return <OrderStepParameters
          {...stepBaseProps}
          wizardType={FrameWizardType.Simple}
          setOrderStatus={setOrderStatus}
          sequenceStepNumber={1}
        />
      case 2:
        return <OrderStepDocumentsAndConditions
          {...stepBaseProps}
          wizardType={FrameWizardType.Simple}
          sequenceStepNumber={2}
        />
      case 3:
        return <OrderStepSendToBank
          {...stepBaseProps}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          sequenceStepNumber={3}
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
      <Card className="Wizard FrameSimpleOperatorWizard">
        <WizardHeader
          title={t('frameSimpleWizard.title')}
          backUrl={backUrl}
          username={username}
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
          <Step disabled={!isFirstStepActive()} title={t('frameSimpleWizard.firstStep.title')}/>
          <Step disabled={!isSecondStepActive()} title={t('frameSimpleWizard.secondStep.title')}/>
          <Step disabled={!isThirdStepActive()} title={t('frameSimpleWizard.thirdStep.title')}/>
        </Steps>
      </Card>
      <Card className="FrameSimpleOperatorWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameSimpleOperatorWizard
