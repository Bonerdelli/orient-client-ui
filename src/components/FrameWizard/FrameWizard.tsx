import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Typography, Card, Steps, Skeleton, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

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
  const { itemId } = useParams<FrameWizardPathParams>()
  const company = useStoreState(state => state.company.current)

  const [ selectedStep, setSelectedStep ] = useState<number>(0)
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const [ currentStepData, setCurrentStepData ] = useState<unknown>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ companyId, setCompanyId ] = useState<number>()

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
      const stepInd = (result.data as any).step - 1
      setCurrentStep(stepInd)
      setSelectedStep(stepInd)
    }
    setStepDataLoading(false)
  }

  const renderCurrentStep = () => {
    if (!company || stepDataLoading) {
      return <Skeleton active={true} />
    }
    switch (selectedStep) {
      case 0:
        return <FrameSelectInn
          companyId={company?.id as number}
          orderId={Number(itemId) || orderId}
          currentStep={currentStep}
          currentStepData={currentStepData}
          setCurrentStep={setSelectedStep}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
      case 1:
        return <FrameDocuments
          companyId={company?.id as number}
          currentStep={currentStep}
          setCurrentStep={setSelectedStep}
          orderId={Number(itemId) || orderId}
          customerId={-1}
        />
      case 2:
        return <FrameSignDocuments
          companyId={company?.id as number}
          currentStep={currentStep}
          setCurrentStep={setSelectedStep}
          orderId={Number(itemId) || orderId}
          customerId={-1}
        />
      case 3:
        return <FrameBankOffers
          companyId={company?.id as number}
          currentStep={currentStep}
          setCurrentStep={setSelectedStep}
          orderId={Number(itemId) || orderId}
          customerId={-1}
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

  return (
    <>
      <Card className="Wizard FrameWizard">
        <Title level={3}>{renderTitle()}</Title>
        <Steps current={stepDataLoading ? undefined : selectedStep} onChange={setSelectedStep}>
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
