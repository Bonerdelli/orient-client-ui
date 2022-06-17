import { useState } from 'react'
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

  const [ currentStep, setCurrentStep ] = useState<number>(0)

  const [ selectedCustomer, setSelectedCustomer ] = useState<Customer>()

  const renderCurrentStep = () => {
    if (!company) {
      return <Skeleton active={true} />
    }
    switch (currentStep) {
      case 0:
        return <FrameSelectInn
          companyId={company?.id as number}
          orderId={Number(itemId) || orderId}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
      case 1:
        return <FrameDocuments
          companyId={company?.id as number}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          orderId={Number(itemId) || orderId}
          customerId={-1}
        />
      case 2:
        return <FrameSignDocuments
          companyId={company?.id as number}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          orderId={Number(itemId) || orderId}
          customerId={-1}
        />
      case 3:
        return <FrameBankOffers
          companyId={company?.id as number}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
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
        <Steps current={currentStep} onChange={setCurrentStep}>
          <Step title={t('frameOrder.firstStep.title')} />
          <Step disabled={!selectedCustomer} title={t('frameOrder.secondStep.title')} />
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
