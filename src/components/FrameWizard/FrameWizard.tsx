import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Card, Steps, Skeleton } from 'antd'

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
}

export const FRAME_WIZARD_LAST_STEP_INDEX = 3

const FrameWizard: React.FC<FrameWizardProps> = ({ orderId }) => {
  const { t } = useTranslation()

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
          orderId={orderId}
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
          orderId={orderId}
          customerId={-1}
        />
      case 2:
        return <FrameSignDocuments
          companyId={company?.id as number}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          orderId={orderId}
          customerId={-1}
        />
      case 3:
        return <FrameBankOffers
          companyId={company?.id as number}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          orderId={orderId}
          customerId={-1}
        />
      default:
        return <></>
    }
  }

  return (
    <>
      <Card className="Wizard FrameWizard">
        <Title level={3}>{t('frameOrder.title')}</Title>
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
