import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Typography, Row, Col, Card, Steps } from 'antd'

import Div from 'components/Div'

import FrameSelectInn from 'components/FrameSelectInn'
import FrameDocuments from 'components/FrameDocuments'
import FrameSignDocuments from 'components/FrameSignDocuments'
import FrameBankOffers from 'components/FrameBankOffers'

import './FrameWizard.style.less'

const { Step } = Steps
const { Title } = Typography

export interface FrameWizardProps {

}

const LAST_STEP_INDEX = 3

const FrameWizard: React.FC<FrameWizardProps> = ({}) => {
  const { t } = useTranslation()
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <FrameSelectInn onNavigateNextAllow={handleFirstStepAllowNext} />
      case 1:
        return <FrameDocuments orderId={0} customerId={0} />
      case 2:
        return <FrameSignDocuments />
      case 3:
        return <FrameBankOffers />
      default:
        return <></>
    }
  }
  const handleFirstStepAllowNext = (allow: boolean) => {
    if (allow) {
      console.log('handleFirstStepAllowNext')
    }
  }
  const handleNextStep = () => {
    if (currentStep < LAST_STEP_INDEX) {
      setCurrentStep(currentStep + 1)
    }
  }
  const renderCancelButton = () => {
    return (<></>)
  }
  const renderNextButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handleNextStep}
      >
        {t('orders.actions.next.title')}
      </Button>
    )
  }
  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col>{renderCancelButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  return (
    <>
      <Card className="Wizard FrameWizard">
        <Title level={3}>{t('frameOrder.title')}</Title>
        <Steps current={currentStep} onChange={setCurrentStep}>
          <Step title={t('frameOrder.firstStep.title')} />
          <Step title={t('frameOrder.secondStep.title')} />
          <Step title={t('frameOrder.thirdStep.title')} />
          <Step title={t('frameOrder.fourthStep.title')} />
        </Steps>
      </Card>
      <Card className="FrameWizard__step">
        <Div className="FrameWizard__step__content">
          {renderCurrentStep()}
          {renderActions()}
        </Div>
      </Card>
    </>
  )
}

export default FrameWizard
