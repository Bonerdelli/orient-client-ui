import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { sortBy } from 'lodash'

import { Typography, Skeleton, Spin, Row, Col, Button, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import { OrderCheckList as OrderCheckListModel } from 'library/models'
import OrderDocumentsList from 'components/OrderDocumentsList'
import OrderCheckList from 'components/OrderCheckList'

import {
  getFrameWizardStep,
  sendFrameWizardStep2,
  updateFrameWizardCheckList,
} from 'library/api/frameWizard'

import './OrderStepDocuments.style.less'

const { Title } = Typography

export interface OrderDocumentsProps {
  wizardType?: FrameWizardType
  bankId?: number | bigint
  orderId?: number
  offerStatus?: BankOfferStatus
  setOfferStatus: (step: BankOfferStatus) => void
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepDocuments: React.FC<OrderDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  bankId,
  orderId,
  offerStatus,
  setOfferStatus,
  currentStep,
  sequenceStepNumber,
  setCurrentStep,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(true)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate models
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])
  const [ documentTypesOptional, setDocumentTypesOptional ] = useState<number[]>()
  const [ documentsOptional, setDocumentsOptional ] = useState<OrderDocument[] | null>()
  const [ documentTypesGenerated, setDocumentTypesGenerated ] = useState<number[]>()
  const [ documentsGenerated, setDocumentsGenerated ] = useState<OrderDocument[] | null>()
  const [ isAccepted, setAccepted ] = useState<boolean>()

  useEffect(() => {
    loadStepData()
  }, [ currentStep ])

  useEffect(() => {
    if (offerStatus) {
      setAccepted(offerStatus === BankOfferStatus.Completed)
    }
  }, [ offerStatus ])

  useEffect(() => {
    if (!stepData) return

    const currentDocuments = stepData?.documents ?? []
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentsOptional: OrderDocument[] = []
    const updatedDocumentsGenerated: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []
    const updatedDocumentTypesOptional: number[] = []
    const updatedDocumentTypesGenerated: number[] = []

    sortBy(currentDocuments, 'priority')
      .filter((doc: OrderDocument) => Boolean(doc.info))
      .forEach((doc: OrderDocument) => {
        if (doc.isGenerated) {
          updatedDocumentTypesGenerated.push(doc.typeId)
          updatedDocumentsGenerated.push(doc)
        } else if (doc.isRequired) {
          updatedDocumentTypes.push(doc.typeId)
          updatedDocuments.push(doc)
        } else {
          updatedDocumentTypesOptional.push(doc.typeId)
          updatedDocumentsOptional.push(doc)
        }
      })

    setDocuments(updatedDocuments)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentTypesOptional(updatedDocumentTypesOptional)
    setDocumentsOptional(updatedDocumentsOptional.length ? updatedDocumentsOptional : null)
    setDocumentTypesGenerated(updatedDocumentTypesGenerated)
    setDocumentsGenerated(updatedDocumentsGenerated.length ? updatedDocumentsGenerated : null)
    setDocumentsLoading(false)
  }, [ stepData ])

  const loadStepData = async () => {
    if (documentTypes === null) {
      // NOTE: do not show loader every time updates
      setDocumentsLoading(true)
    }
    const result = await getFrameWizardStep({
      type: wizardType,
      step: sequenceStepNumber,
      bankId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<any>).data) // TODO: ask be to generate models
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const sendNextStep = async () => {
    if (!orderId) {
      return
    }
    setSubmitting(true)
    const result = await sendFrameWizardStep2({
      type: wizardType,
      bankId,
      orderId,
    }, undefined)
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setOfferStatus(BankOfferStatus.BankOffer)
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
      if (currentStep <= sequenceStepNumber) {
        sendNextStep()
      } else {
        setCurrentStep(sequenceStepNumber + 1)
      }
    }
  }

  const handleCheckListChange = async (value: OrderCheckListModel[]) => {
    const result = await updateFrameWizardCheckList({
      type: wizardType,
      bankId,
      orderId,
    }, {
      checks: value,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
    }
  }

  const renderPrevStepButton = () => {
    // NOTE: disabled as we can't go back by status model
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
        {t('orderActions.next.title')}
      </Button>
    )
  }

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col>{renderPrevStepButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const renderDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        types={documentTypes || []}
        checkSignedFn={document => document.info?.clientSigned === true}
        current={documents}
      />
    </Spin>
  )

  const renderOptionalDocumentsSection = () => (
    <Div className="WizardStep__section">
      <Title level={5}>{t('orderStepDocuments.sectionTitles.additionalDocs')}</Title>
      {renderOptionalDocuments()}
    </Div>
  )

  const renderOptionalDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        types={documentTypesOptional as number[]}
        checkSignedFn={document => document.info?.clientSigned === true}
        current={documentsOptional as OrderDocument[]}
      />
    </Spin>
  )

  const renderGeneratedDocumentsSection = () => (
    <Div className="WizardStep__section">
      <Title level={5}>{t('orderStepDocuments.sectionTitles.autoGeneratedDocs')}</Title>
      {renderGeneratedDocuments()}
    </Div>
  )

  const renderGeneratedDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        types={documentTypesGenerated as number[]}
        checkSignedFn={document => document.info?.clientSigned === true}
        current={documentsGenerated as OrderDocument[]}
      />
    </Spin>
  )

  const renderStepContent = () => (
    <Div className="OrderStepDocuments">
      <Div className="OrderStepDocuments__title">
        <Title level={4}>{t('orderStepDocuments.title')}</Title>
      </Div>
      <Div className="WizardStep__section">
        <Title level={5}>{t('orderStepDocuments.sectionTitles.mainDocs')}</Title>
        {renderDocuments()}
      </Div>
      {documentsOptional !== null && renderOptionalDocumentsSection()}
      {documentsGenerated !== null && renderGeneratedDocumentsSection()}
      <Div className="WizardStep__section">
        <Title level={5}>{t('orderStepDocuments.sectionTitles.checkList')}</Title>
        <OrderCheckList checkList={stepData?.checks} onChange={handleCheckListChange} />
      </Div>
    </Div>
  )

  if (!stepData && stepDataLoading) {
    return (
      <Skeleton active={true}/>
    )
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning"/>
    )
  }

  return (
    <Div className="WizardStep__content">
      {renderStepContent()}
      {!isAccepted && renderActions()}
    </Div>
  )
}

export default OrderStepDocuments
