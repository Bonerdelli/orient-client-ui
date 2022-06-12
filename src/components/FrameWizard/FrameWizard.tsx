import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Typography, Select, Row, Col, Grid, Card, Steps, Form, Empty, Input } from 'antd'

import Div from 'components/Div'

import './FrameWizard.style.less'

import { baseFormConfig } from 'library/helpers/form'


const { Step } = Steps
const { Title, Paragraph } = Typography
const { Item: FormItem } = Form
const { useBreakpoint } = Grid

export interface FrameWizardProps {

}

const LAST_STEP_INDEX = 3

const FrameWizard: React.FC<FrameWizardProps> = ({}) => {
  const { t } = useTranslation()
  const breakPoint = useBreakpoint()
  const [ currentStep, setCurrentStep ] = useState<number>(0)
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderFirstStep()
      case 1:
        return renderSecondStep()
      case 2:
        return renderThirdStep()
      case 3:
        return renderFourthStep()
      default:
        return <></>
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
      <Button size="large" type="primary" onClick={handleNextStep}>{t('orders.actions.next.title')}</Button>
    )
  }
  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col>{renderCancelButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )
  // TODO: to ui-lib
  const renderEmptyResult = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={t('common.forms.select.noData')}
    />
  )
  const renderFirstStep = () => (
    <Div className="FrameWizard__step__content">
      <Title level={5}>{t('frameSteps.selectInn.title')}</Title>
      <Row>
        <Col lg={12} xl={10}>
          <Select
            showSearch
            notFoundContent={renderEmptyResult()}
            placeholder={t('frameSteps.selectInn.placeholder')}
          >
          </Select>
        </Col>
      </Row>
      {renderActions()}
    </Div>
  )
  const renderSecondStep = () => (
    <Div className="FrameWizard__step__content">
      <Title level={5}>{t('frameSteps.documents.title')}</Title>
      {renderActions()}
    </Div>
  )
  const renderThirdStep = () => (
    <Div className="FrameWizard__step__content">
      <Title level={5}>{t('frameSteps.signDocuments.sectionTitles.signDocuments')}</Title>
      {renderActions()}
    </Div>
  )
  const renderFourthStep = () => (
    <Div className="FrameWizard__step__content">
      <Title level={5}>{t('frameSteps.bankOffers.bankList.title')}</Title>
      {renderActions()}
    </Div>
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
        {renderCurrentStep()}
      </Card>
    </>
  )
}

export default FrameWizard
