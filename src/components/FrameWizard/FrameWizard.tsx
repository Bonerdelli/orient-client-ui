import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Card, Steps } from 'antd'

import Div from 'components/Div'

import './FrameWizard.style.less'

const { Step } = Steps
const { Title, Paragraph } = Typography

export interface FrameWizardProps {

}

const FrameWizard: React.FC<FrameWizardProps> = ({}) => {
  const { t } = useTranslation()
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderFirstStep()
      case 2:
        return renderSecondStep()
      case 3:
        return renderThirdStep()
      case 4:
        return renderFourthStep()
      default:
        return <></>
    }
  }
  const renderFirstStep = () => (
    <Div className="FrameWizard__step__content">
      <Title>{t('frameSteps.selectInn.desc')}</Title>
    </Div>
  )
  const renderSecondStep = () => (
    <Div className="FrameWizard__step__content">
      <Title>{t('frameSteps.documents.desc')}</Title>
    </Div>
  )
  const renderThirdStep = () => (
    <Div className="FrameWizard__step__content"></Div>
  )
  const renderFourthStep = () => (
    <Div className="FrameWizard__step__content"></Div>
  )
  return (
    <>
      <Card className="Wizard FrameWizard">
        <Steps current={currentStep} onChange={setCurrentStep}>
          <Step title={t('frameOrder.firstStep.title')}>
            {renderFirstStep()}
          </Step>
          <Step title={t('frameOrder.secondStep.title')}>
            {renderSecondStep()}
          </Step>
          <Step title={t('frameOrder.thirdStep.title')}>
            {renderThirdStep()}
          </Step>
          <Step title={t('frameOrder.fourthStep.title')}>
            {renderFourthStep()}
          </Step>
        </Steps>
      </Card>
      <Card className="FrameWizard__step">
        {renderStep()}
      </Card>
    </>
  )
}

export default FrameWizard
