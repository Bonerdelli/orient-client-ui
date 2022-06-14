import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Timeline, Row, Col, Button, message } from 'antd'


import Div from 'components/Div'
import DocumentsList from 'components/DocumentsList'

import { FrameWizardType, sendFrameWizardStep2 } from 'library/api'

import { CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons'

import './FrameDocuments.style.less'

const { Title } = Typography
const { Item: TimelineItem } = Timeline

export interface FrameDocumentsProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId: number
  customerId: number
  currentStep: number
  setCurrentStep: (step: number) => void
}

const PRIMARY_DOC_TYPES = [6, 7] // TODO: FIXME look in db, there is no augmentable types
const SECONDARY_DOC_TYPES = [8] // TODO: FIXME look in db, there is no augmentable types

const FrameDocuments: React.FC<FrameDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  customerId,
  currentStep,
  setCurrentStep,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setIsNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setIsPrevStepAllowed ] = useState<boolean>(true)
  const [ submitting, setSubmitting ] = useState<boolean>()

  const сompanyDataReady = {
    сompanyHead: true,
    bankRequisites: true,
    questionnaire: false,
  }

  const sendNextStep = async () => {
    setSubmitting(true)
    const result = await sendFrameWizardStep2({
      type: wizardType,
      companyId,
      orderId,
    }, {

    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setIsNextStepAllowed(false)
    } else {
      setCurrentStep(currentStep + 1)
    }
    setSubmitting(false)
  }

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const renderCancelButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handlePrevStep}
        disabled={!isPrevStepAllowed}
      >
        {t('common.actions.back.title')}
      </Button>
    )
  }

  const renderNextButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handleNextStep}
        disabled={!isNextStepAllowed || submitting}
        loading={submitting}
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

  const dotParams = (ready: boolean) => ({
    dot: ready
      ? <CheckCircleFilled className="FrameDocuments__companyDataStatus__okIcon" />
      : <ExclamationCircleOutlined />,
    color: ready ? 'green' : 'red',
  })

  const renderStepContent = () => (
    <Div className="FrameDocuments">
      <Div className="FrameDocuments__title">
        <Title level={4}>{t('frameSteps.documents.title')}</Title>
      </Div>
      <Div className="FrameDocuments__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.mainDocs')}</Title>
        <DocumentsList customerId={customerId} orderId={orderId} types={PRIMARY_DOC_TYPES} />
      </Div>
      <Div className="FrameDocuments__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.additionalDocs')}</Title>
        <DocumentsList customerId={customerId} orderId={orderId} types={SECONDARY_DOC_TYPES} />
      </Div>
      <Div className="FrameDocuments__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.сompanyData')}</Title>
        <Timeline className="FrameDocuments__companyDataStatus">
          <TimelineItem {...dotParams(сompanyDataReady.сompanyHead)}>
            {t('frameSteps.documents.сompanyData.сompanyHead')}
          </TimelineItem>
          <TimelineItem {...dotParams(сompanyDataReady.bankRequisites)}>
            {t('frameSteps.documents.сompanyData.bankRequisites')}
          </TimelineItem>
          <TimelineItem {...dotParams(сompanyDataReady.questionnaire)}>
            {t('frameSteps.documents.сompanyData.questionnaire')}
          </TimelineItem>
        </Timeline>
      </Div>
    </Div>
  )

  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default FrameDocuments
