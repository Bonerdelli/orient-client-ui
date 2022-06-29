import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Typography, Card, Steps, Grid, Skeleton, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { OrderStatus } from 'orient-ui-library/library/models'

import FactoringStepParameters from 'components/FactoringStepParameters'
import FactoringStepDocuments from 'components/FactoringStepDocuments'
import FactoringStepSignDocuments from 'components/FactoringStepSignDocuments'
import FactoringStepBankOffers from 'components/FactoringStepBankOffers'

import { useStoreState } from 'library/store'

import { getCurrentFactoringWizardStep } from 'library/api'

import './FactoringClientWizard.style.less'

const { Step } = Steps
const { Title } = Typography
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
  const company = useStoreState(state => state.company.current)

  const [ selectedStep, setSelectedStep ] = useState<number>(1)
  const [ currentStep, setCurrentStep ] = useState<number>(1)
  const [ _currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ companyId, setCompanyId ] = useState<number>()
  const [ orderId, _setOrderId ] = useState<number>()
  const [ orderStatus, setOrderStatus ] = useState<OrderStatus>()

  useEffect(() => {
    if (companyId && (Number(itemId) || orderId)) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [companyId])

  useEffect(() => {
    if (company) {
      setCompanyId(company.id)
    }
  }, [company])

  useEffect(() => {
    if (currentStep === 2 && (
        orderStatus === OrderStatus.FRAME_OPERATOR_VERIFYING ||
        orderStatus === OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY
    )) {
      // NOTE: show waiting for verify message
      setSelectedStep(3)
      setCurrentStep(3)
    }
  }, [currentStep, orderStatus])

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

  const renderCurrentStep = () => {
    if (!companyId || stepDataLoading) {
      return <Skeleton active={true} />
    }
    switch (selectedStep) {
      case 1:
        return <FactoringStepParameters
          companyId={companyId}
          orderId={Number(itemId) || orderId}
          currentStep={currentStep}
          setCurrentStep={setSelectedStep}
          sequenceStepNumber={1}
        />
      case 2:
        return <FactoringStepDocuments
          companyId={companyId}
          currentStep={currentStep}
          sequenceStepNumber={2}
          setCurrentStep={setSelectedStep}
          setOrderStatus={setOrderStatus}
          orderId={Number(itemId) || orderId}
        />
      case 3:
        return <FactoringStepSignDocuments
          companyId={companyId}
          currentStep={currentStep}
          sequenceStepNumber={3}
          setCurrentStep={setSelectedStep}
          orderStatus={orderStatus}
          orderId={Number(itemId) || orderId}
        />
      case 4:
        return <FactoringStepBankOffers
          companyId={company?.id as number}
          currentStep={currentStep}
          sequenceStepNumber={4}
          setCurrentStep={setSelectedStep}
          orderId={Number(itemId) || orderId}
        />
      default:
        return <></>
    }
  }

  const renderTitle = () => {
    const title = t('factoring.title')
    if (!backUrl) return title
    return (
      <>
        <Link className="Wizard__navigateBack" to={backUrl}>
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
      <Card className="Wizard FactoringClientWizard">
        <Title level={3}>{renderTitle()}</Title>
        <Steps
          current={stepDataLoading ? undefined : selectedStep - 1}
          direction={breakpoint.xl ? 'horizontal' : 'vertical'}
          onChange={(step) => setSelectedStep(step + 1)}
        >
          <Step title={t('factoring.firstStep.title')} />
          <Step disabled={!currentStep} title={t('factoring.secondStep.title')} />
          <Step disabled={currentStep < 3} title={t('factoring.thirdStep.title')} />
          <Step disabled={currentStep < 4} title={t('factoring.fourthStep.title')} />
        </Steps>
      </Card>
      <Card className="Wizard__step">
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FactoringClientWizard
