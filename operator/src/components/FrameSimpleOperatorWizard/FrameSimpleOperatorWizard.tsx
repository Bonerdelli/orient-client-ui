import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Typography, Card, Steps, Grid, Skeleton, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import OrderStepParameters from 'components/OrderStepParameters'
import OrderStepDocuments from 'components/OrderStepDocuments'
import OrderStepStopFactors from 'components/OrderStepStopFactors'
// import OrderStepOptionalParameters from 'components/OrderStepOptionalParameters'
import OrderStepScoringResults from 'components/OrderStepScoringResults'

import { getFrameSimpleOrderWizard } from 'library/api/frameOrder'

import './FrameSimpleOperatorWizard.style.less'

const { Step } = Steps
const { Title } = Typography
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

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()

  useEffect(() => {
    setStepDataLoading(true)
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (selectedStep !== currentStep) {
      setSelectedStep(currentStep)
    }
  }, [currentStep])

  const loadCurrentStepData = async () => {
    const result = await getFrameSimpleOrderWizard({
      orderId: Number(itemId) || orderId as number,
    })
    if (result.success) {
      const step = Number((result.data as any).step)
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
  // const isFourthStepActive = (): boolean => currentStep > 1 // NOTE: disabled for Demo
  const isFifthStepActive = (): boolean => currentStep > 3

  const renderCurrentStep = () => {
    if (stepDataLoading) {
      return <Skeleton active={true} />
    }
    const stepBaseProps = {
      orderId: Number(itemId) || orderId,
      currentStep: currentStep,
      setCurrentStep: setCurrentStep,
    }
    switch (selectedStep) {
      case 1:
        return <OrderStepParameters {...stepBaseProps} sequenceStepNumber={1}/>
      case 2:
        return <OrderStepDocuments {...stepBaseProps} sequenceStepNumber={2}/>
      case 3:
        return <OrderStepStopFactors {...stepBaseProps} sequenceStepNumber={3}/>
      // case 4: // NOTE: disabled for Demo
      //   return <OrderStepOptionalParameters {...stepBaseProps} sequenceStepNumber={4}/>
      case 4:
        return <OrderStepScoringResults {...stepBaseProps} sequenceStepNumber={4}/>
      default:
        return <></>
    }
  }

  const renderTitle = () => {
    const title = t('frameWizard.title')
    if (!backUrl) return title
    return (
      <>
        <Link className="FrameSimpleOperatorWizard__navigateBack" to={backUrl}>
          <Button icon={<ArrowLeftOutlined />} type="link" size="large"></Button>
        </Link>
        {title}
      </>
    )
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning" />
    )
  }

  return (
    <>
      <Card className="Wizard FrameSimpleOperatorWizard">
        <Title level={3}>{renderTitle()}</Title>
        <Steps
          current={stepDataLoading ? undefined : selectedStep - 1}
          direction={breakpoint.xl ? 'horizontal' : 'vertical'}
          onChange={(step) => setSelectedStep(step + 1)}
        >
          <Step disabled={!isFirstStepActive()} title={t('frameWizard.firstStep.title')} />
          <Step disabled={!isSecondStepActive()} title={t('frameWizard.secondStep.title')} />
          <Step disabled={!isThirdStepActive()} title={t('frameWizard.thirdStep.title')} />
          <Step disabled={!isFifthStepActive()} title={t('frameWizard.fifthStep.title')} />
        </Steps>
      </Card>
      <Card className="FrameSimpleOperatorWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameSimpleOperatorWizard