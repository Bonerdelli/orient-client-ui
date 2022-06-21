import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Typography, Card, Steps, Grid, Skeleton, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import OrderStepParameters from 'components/OrderStepParameters'
import OrderStepDocuments from 'components/OrderStepDocuments'
import OrderStepContractParams from 'components/OrderStepContractParams'
import OrderStepContractDocuments from 'components/OrderStepContractDocuments'
import OrderStepOfferAcceptance from 'components/OrderStepOfferAcceptance'
import OrderStepArchive from 'components/OrderStepArchive'

import { OrderWizardType } from 'library/models'
import { useStoreState } from 'library/store'

import { getFrameOrderWizard } from 'library/api/frameOrder'
import { MOCK_BANK_ID } from 'library/mock/bank'

import './FrameBankWizard.style.less'

const { Step } = Steps
const { Title } = Typography
const { useBreakpoint } = Grid

export interface FrameBankWizardProps {
  orderId?: number
  backUrl?: string
}

export interface FrameBankWizardPathParams {
  itemId?: string,
}

export const FRAME_WIZARD_LAST_STEP_INDEX = 5

const FrameBankWizard: React.FC<FrameBankWizardProps> = ({ orderId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FrameBankWizardPathParams>()
  const company = useStoreState(state => state.company.current)

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
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
      bankId: MOCK_BANK_ID,
    })
    if (result.success) {
      setCurrentStepData((result.data as any).data)
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
  const isSecondStepActive = (): boolean => true
  const isThirdStepActive = (): boolean => true
  const isFourthStepActive = (): boolean => true
  const isFifthStepActive = (): boolean => true
  const isSixthStepActive = (): boolean => true

  const renderCurrentStep = () => {
    if (!companyId || stepDataLoading) {
      return <Skeleton active={true} />
    }
    const stepBaseProps = {
      bankId: MOCK_BANK_ID,
      orderId: Number(itemId) || orderId,
      oprderType: OrderWizardType.Frame,
      currentStep: currentStep,
      setCurrentStep: setSelectedStep,
    }
    switch (selectedStep) {
      case 1:
        return <OrderStepParameters {...stepBaseProps}/>
      case 2:
        return <OrderStepDocuments {...stepBaseProps}/>
      case 3:
        return <OrderStepContractParams {...stepBaseProps}/>
      case 4:
        return <OrderStepContractDocuments {...stepBaseProps}/>
      case 5:
        return <OrderStepOfferAcceptance {...stepBaseProps}/>
      case 6:
        return <OrderStepArchive {...stepBaseProps}/>
      default:
        return <></>
    }
  }

  const renderTitle = () => {
    const title = t('frameWizard.title')
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

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning" />
    )
  }

  return (
    <>
      <Card className="Wizard FrameWizard">
        <Title level={3}>{renderTitle()}</Title>
        <Steps
          current={stepDataLoading ? undefined : selectedStep - 1}
          direction={breakpoint.xl ? 'horizontal' : 'vertical'}
          onChange={(step) => setSelectedStep(step + 1)}
        >
          <Step disabled={!isFirstStepActive()} title={t('frameWizard.firstStep.title')} />
          <Step disabled={!isSecondStepActive()} title={t('frameWizard.secondStep.title')} />
          <Step disabled={!isThirdStepActive()} title={t('frameWizard.thirdStep.title')} />
          <Step disabled={!isFourthStepActive()} title={t('frameWizard.fourthStep.title')} />
          <Step disabled={!isFifthStepActive()} title={t('frameWizard.fifthStep.title')} />
          <Step disabled={!isSixthStepActive()} title={t('frameWizard.sixthStep.title')} />
        </Steps>
      </Card>
      <Card className="FrameWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameBankWizard
