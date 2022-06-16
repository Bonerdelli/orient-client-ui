import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Typography, Card, Steps, Grid, Skeleton, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import OrderStepParameters from 'components/__operator/OrderStepParameters'
import OrderStepDocuments from 'components/__operator/OrderStepDocuments'
import OrderStepStopFactors from 'components/__operator/OrderStepStopFactors'
import OrderStepOptionalParameters from 'components/__operator/OrderStepOptionalParameters'
import OrderStepScoringResults from 'components/__operator/OrderStepScoringResults'

import { OrderWizardType } from 'library/models'
import { useStoreState } from 'library/store'

import { getFrameOrderWizard } from 'library/api/__operator/frameOrder'

import './FrameOperatorWizard.style.less'

const { Step } = Steps
const { Title } = Typography
const { useBreakpoint } = Grid

export interface FrameOperatorWizardProps {
  orderId?: number
  backUrl?: string
}

export interface FrameOperatorWizardPathParams {
  itemId?: string,
}

export const FRAME_WIZARD_LAST_STEP_INDEX = 4

const FrameOperatorWizard: React.FC<FrameOperatorWizardProps> = ({ orderId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FrameOperatorWizardPathParams>()
  const company = useStoreState(state => state.company.current)

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ companyId, setCompanyId ] = useState<number>()

  useEffect(() => {
    if (companyId) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [companyId])

  useEffect(() => {
    if (company) {
      setCompanyId(company.id)
    }
  }, [company])

  const loadCurrentStepData = async () => {
    const result = await getFrameOrderWizard({
      orderId: Number(itemId) || orderId as number,
    })
    if (result.success) {
      setCurrentStepData((result.data as any).data)
      const stepInd = (result.data as any).step - 1
      setCurrentStep(stepInd)
      setSelectedStep(stepInd)
    }
    setStepDataLoading(false)
  }

  const isFirstStepActive = (): boolean => true
  const isSecondStepActive = (): boolean => true
  const isThirdStepActive = (): boolean => true
  const isFourthStepActive = (): boolean => true
  const isFifthStepActive = (): boolean => true

  const renderCurrentStep = () => {
    if (!companyId || stepDataLoading) {
      return <Skeleton active={true} />
    }
    const stepBaseProps = {
      orderId: Number(itemId) || orderId,
      oprderType: OrderWizardType.Frame,
      currentStep: currentStep,
      setCurrentStep: setSelectedStep,
    }
    switch (selectedStep) {
      case 0:
        return <OrderStepParameters {...stepBaseProps}/>
      case 1:
        return <OrderStepDocuments {...stepBaseProps}/>
      case 2:
        return <OrderStepStopFactors {...stepBaseProps}/>
      case 3:
        return <OrderStepOptionalParameters {...stepBaseProps}/>
      case 4:
        return <OrderStepScoringResults {...stepBaseProps}/>
      default:
        return <></>
    }
  }

  const renderTitle = () => {
    const title = t('__operator.frameWizard.title')
    if (!backUrl) return title
    return (
      <>
        <Link className="FrameWizard__navigateBack" to={backUrl}>
          <Button icon={<ArrowLeftOutlined />} type="link" size="large"></Button>
        </Link>
        {title}
      </>
    )
  }

  return (
    <>
      <Card className="Wizard FrameWizard">
        <Title level={3}>{renderTitle()}</Title>
        <Steps
          current={stepDataLoading ? undefined : selectedStep}
          direction={breakpoint.xl ? 'horizontal' : 'vertical'}
          onChange={setSelectedStep}
        >
          <Step disabled={!isFirstStepActive()} title={t('__operator.frameWizard.firstStep.title')} />
          <Step disabled={!isSecondStepActive()} title={t('__operator.frameWizard.secondStep.title')} />
          <Step disabled={!isThirdStepActive()} title={t('__operator.frameWizard.thirdStep.title')} />
          <Step disabled={!isFourthStepActive()} title={t('__operator.frameWizard.fourthStep.title')} />
          <Step disabled={!isFifthStepActive()} title={t('__operator.frameWizard.fifthStep.title')} />
        </Steps>
      </Card>
      <Card className="FrameWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameOperatorWizard
