import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Typography, Card, Steps, Grid, Skeleton, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import ErrorResultView from 'components/ErrorResultView' // TODO: from ui-lib

import FrameSelectInn from 'components/FrameSelectInn'
import FrameDocuments from 'components/FrameDocuments'
import FrameSignDocuments from 'components/FrameSignDocuments'
import FrameBankOffers from 'components/FrameBankOffers'

import { Customer } from 'library/models'
import { useStoreState } from 'library/store'

import { FrameWizardType, getCurrentFrameWizardStep } from 'library/api'

import './FrameWizard.style.less'

const { Step } = Steps
const { Title } = Typography
const { useBreakpoint } = Grid

export interface FrameWizardProps {
  orderId?: number
  backUrl?: string
}

export interface FrameWizardPathParams {
  itemId?: string,
}

export const FRAME_WIZARD_LAST_STEP_INDEX = 3

const FrameWizard: React.FC<FrameWizardProps> = ({ orderId, backUrl }) => {
  const { t } = useTranslation()
  const breakpoint = useBreakpoint()

  const { itemId } = useParams<FrameWizardPathParams>()
  const company = useStoreState(state => state.company.current)

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ companyId, setCompanyId ] = useState<number>()

  // TODO: BE doesn't sent customer, fix after DE fixes
  const [ selectedCustomer, setSelectedCustomer ] = useState<Customer>()

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
    const result = await getCurrentFrameWizardStep({
      type: FrameWizardType.Full,
      companyId: companyId as number,
      orderId: Number(itemId) || orderId,
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

  const renderCurrentStep = () => {
    if (!companyId || stepDataLoading) {
      return <Skeleton active={true} />
    }
    switch (selectedStep) {
      case 1:
        return <FrameSelectInn
          companyId={companyId}
          orderId={Number(itemId) || orderId}
          currentStep={currentStep}
          currentStepData={currentStepData}
          setCurrentStep={setSelectedStep}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
      case 2:
        return <FrameDocuments
          companyId={companyId}
          currentStep={currentStep}
          setCurrentStep={setSelectedStep}
          orderId={Number(itemId) || orderId}
          customerId={selectedCustomer?.id}
        />
      case 3:
        return <FrameSignDocuments
          companyId={companyId}
          currentStep={currentStep}
          setCurrentStep={setSelectedStep}
          orderId={Number(itemId) || orderId}
          customerId={selectedCustomer?.id}
        />
      case 4:
        return <FrameBankOffers
          companyId={company?.id as number}
          currentStep={currentStep}
          setCurrentStep={setSelectedStep}
          orderId={Number(itemId) || orderId}
          customerId={selectedCustomer?.id}
        />
      default:
        return <></>
    }
  }

  const renderTitle = () => {
    const title = t('frameOrder.title')
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
          <Step title={t('frameOrder.firstStep.title')} />
          <Step disabled={!selectedCustomer && !currentStep} title={t('frameOrder.secondStep.title')} />
          <Step disabled title={t('frameOrder.thirdStep.title')} />
          <Step disabled title={t('frameOrder.fourthStep.title')} />
        </Steps>
      </Card>
      <Card className="FrameWizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameWizard
