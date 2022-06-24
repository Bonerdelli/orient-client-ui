import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { Typography, Timeline, Skeleton, Spin, Row, Col, Button, message } from 'antd'
import { CheckCircleFilled, ExclamationCircleOutlined, ClockCircleOutlined, FormOutlined } from '@ant-design/icons'
import { every } from 'lodash'

import Div from 'orient-ui-library/components/Div'
import OrderDocumentsList from 'components/OrderDocumentsList'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { OrderDocument } from 'orient-ui-library/library/models/proxy'
import { WizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'

import {
  WizardStep2Data,
  getFrameWizardStep,
  sendFrameWizardStep2,
} from 'library/api'

import './OrderStepDocuments.style.less'

const { Title } = Typography
const { Item: TimelineItem } = Timeline

export interface OrderDocumentsProps {
  wizardType?: FrameWizardType
  companyId?: number
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const сompanyDataInitialStatus: Record<string, boolean | null> = {
  сompanyHead: null,
  bankRequisites: null,
  questionnaire: null,
}

const OrderStepDocuments: React.FC<OrderDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  currentStep,
  sequenceStepNumber,
  setCurrentStep,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setIsNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setIsPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<WizardStep2Data>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ сompanyDataStatus, setСompanyDataStatus ] = useState({ ...сompanyDataInitialStatus })
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[]>([])
  const [ documentTypesOptional, setDocumentTypesOptional ] = useState<number[]>([])
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])
  const [ documentsOptional, setDocumentsOptional ] = useState<OrderDocument[]>([])

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    let isAllDocumentsReady = true
    const currentDocuments = stepData?.documents ?? []
    if (currentDocuments) {
      isAllDocumentsReady = updateCurrentDocuments(currentDocuments)
    }

    const updatedCompanyStatus = {
      сompanyHead: Boolean(stepData?.founder),
      bankRequisites: Boolean(stepData?.requisites),
      questionnaire: Boolean(stepData?.questionnaire),
    }

    const isCompanyDataReady = every(updatedCompanyStatus, Boolean)
    setIsNextStepAllowed(isAllDocumentsReady && isCompanyDataReady)
    setСompanyDataStatus(updatedCompanyStatus)

  }, [stepData])

  const updateCurrentDocuments = (documents: OrderDocument[]): boolean => {
    let isAllDocumentsReady = true
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentsOptional: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []
    const updatedDocumentTypesOptional: number[] = []

    documents
      .filter((doc: OrderDocument) => !doc.isGenerated)
      .forEach((doc: OrderDocument) => {
        if (doc.isRequired) {
          isAllDocumentsReady = isAllDocumentsReady && doc.info !== null
          updatedDocumentTypes.push(doc.typeId)
          updatedDocuments.push(doc)
        } else {
          updatedDocumentTypesOptional.push(doc.typeId)
          updatedDocumentsOptional.push(doc)
        }
      })

    setDocuments(updatedDocuments)
    setDocumentsOptional(updatedDocumentsOptional)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentTypesOptional(updatedDocumentTypesOptional)
    setDocumentsLoading(false)
    return isAllDocumentsReady
  }

  const loadCurrentStepData = async () => {
    setDocumentsLoading(true)
    const result = await getFrameWizardStep({
      type: wizardType,
      companyId: companyId as number,
      step: currentStep,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as WizardStepResponse<WizardStep2Data>).data)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const sendNextStep = async () => {
    if (!orderId || !companyId) {
      return
    }
    setSubmitting(true)
    const documentStatuses = [
      ...documentsOptional,
      ...documents,
    ].map(document => ({
      documentId: document.info?.documentId,
      status: document.info?.documentStatus,
    }))
    const result = await sendFrameWizardStep2({
      type: wizardType,
      companyId,
      orderId,
    }, {
      documentStatuses,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setIsNextStepAllowed(false)
    } else {
      setCurrentStep(sequenceStepNumber + 1)
    }
    setSubmitting(false)
  }

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(sequenceStepNumber - 1)
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

  const dotParams = (ready: boolean | null) => ({
    dot: ready === true
      ? <CheckCircleFilled className="OrderStepDocuments__companyDataStatus__okIcon" />
      : (ready === null ? <ClockCircleOutlined /> : <ExclamationCircleOutlined />),
    color: ready === true ? 'green'
      : (ready === null ? 'grey' : 'red'),
  })

  const renderReadyStatuses = () => (
    <Timeline className="OrderStepDocuments__companyDataStatus">
      <TimelineItem {...dotParams(сompanyDataStatus?.сompanyHead ?? null)}>
        {t('frameSteps.documents.сompanyData.сompanyHead')}
        {!сompanyDataStatus?.сompanyHead && (
          <NavLink to="/my-company" className="OrderStepDocuments__companyDataStatus__link">
            <Button size="small" type="link" icon={<FormOutlined />}>
              {t('frameSteps.documents.fillDataButton.title')}
            </Button>
          </NavLink>
        )}
      </TimelineItem>
      <TimelineItem {...dotParams(сompanyDataStatus?.bankRequisites ?? null)}>
        {t('frameSteps.documents.сompanyData.bankRequisites')}
        {!сompanyDataStatus?.bankRequisites && (
          <NavLink to="/my-company" className="OrderStepDocuments__companyDataStatus__link">
            <Button size="small" type="link" icon={<FormOutlined />}>
              {t('frameSteps.documents.fillDataButton.title')}
            </Button>
          </NavLink>
        )}
      </TimelineItem>
      <TimelineItem {...dotParams(сompanyDataStatus?.questionnaire ?? null)}>
        {t('frameSteps.documents.сompanyData.questionnaire')}
        {!сompanyDataStatus?.questionnaire && (
          <NavLink to="/questionnaire" className="OrderStepDocuments__companyDataStatus__link">
            <Button size="small" type="link" icon={<FormOutlined />}>
              {t('frameSteps.documents.fillDataButton.title')}
            </Button>
          </NavLink>
        )}
      </TimelineItem>
    </Timeline>
  )

  const renderDocuments = () =>  (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        companyId={companyId as number}
        orderId={orderId as number}
        types={documentTypes}
        current={documents}
        onChange={loadCurrentStepData}
      />
    </Spin>
  )

  const renderOprionalDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        companyId={companyId as number}
        orderId={orderId as number}
        types={documentTypesOptional}
        current={documentsOptional}
        onChange={loadCurrentStepData}
      />
    </Spin>
  )

  const renderStepContent = () => (
    <Div className="OrderStepDocuments">
      <Div className="OrderStepDocuments__title">
        <Title level={4}>{t('frameSteps.documents.title')}</Title>
      </Div>
      <Div className="OrderStepDocuments__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.mainDocs')}</Title>
        {renderDocuments()}
      </Div>
      <Div className="OrderStepDocuments__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.additionalDocs')}</Title>
        {renderOprionalDocuments()}
      </Div>
      <Div className="OrderStepDocuments__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.сompanyData')}</Title>
        {renderReadyStatuses()}
      </Div>
    </Div>
  )

  if (!stepData && stepDataLoading) {
    return (
      <Skeleton active={true} />
    )
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning" />
    )
  }

  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {currentStep <= sequenceStepNumber && renderActions()}
    </Div>
  )
}

export default OrderStepDocuments
