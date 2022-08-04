import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sortBy } from 'lodash'

import { Button, Col, Drawer, message, Modal, Row, Skeleton, Spin, Typography } from 'antd'

import { SelectOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import CompanyFounderInfo from 'orient-ui-library/components/CompanyFounderInfo'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { OrderStatus } from 'orient-ui-library/library/models/order'
import { FrameWizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { CompanyFounderDto, CompanyQuestionnaireDto } from 'orient-ui-library/library/models/proxy'

import RejectOrderModal from 'components/RejectOrderModal'
import OrderDocumentsList from 'components/OrderDocumentsList'
import { REJECT_ALLOWED_STATUSES } from 'library/models/frameWizard'
import { DocumentStatus } from 'library/models'

import {
  frameWizardSetDocStatus,
  getFrameWizardStep,
  sendFrameWizardStep2,
  frameWizardReject,
} from 'library/api/frameWizard'

import './OrderStepDocuments.style.less'
import { useStoreState } from 'library/store'
import QuestionnaireForm from 'orient-ui-library/components/QuestionnaireForm'

const { Title } = Typography

export interface OrderDocumentsProps {
  wizardType?: FrameWizardType
  orderId?: number
  currentStep: number
  orderStatus?: OrderStatus
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: OrderStatus) => void
  isCurrentUserAssigned: boolean
  assignCurrentUser: () => Promise<unknown>
}

const OrderStepDocuments: React.FC<OrderDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  orderId,
  currentStep,
  orderStatus,
  sequenceStepNumber,
  setCurrentStep,
  setOrderStatus,
  isCurrentUserAssigned,
  assignCurrentUser,
}) => {
  const { t } = useTranslation()
  const dictionaries = useStoreState(state => state.dictionary.list)

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(true)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate models
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ documentTypesOptional, setDocumentTypesOptional ] = useState<number[]>()
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])
  const [ documentsOptional, setDocumentsOptional ] = useState<OrderDocument[] | null>()

  const [ clientCompanyFounder, setClientCompanyFounder ] = useState<CompanyFounderDto | null>(null)
  const [ companyFounderModalVisible, setCompanyFounderModalVisible ] = useState<boolean>(false)

  const [ clientCompanyQuestionnaire, setClientCompanyQuestionnaire ] = useState<CompanyQuestionnaireDto | null>(null)
  const [ companyQuestionnaireModalVisible, setCompanyQuestionnaireModalVisible ] = useState<boolean>(false)

  const [ rejectModalOpened, setRejectModalOpened ] = useState<boolean>(false)

  useEffect(() => {
    loadStepData()
  }, [ currentStep ])

  useEffect(() => {
    if (!stepData) return

    const currentDocuments = stepData?.documents ?? []
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentsOptional: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []
    const updatedDocumentTypesOptional: number[] = []

    sortBy(currentDocuments, 'priority')
      .filter((doc: OrderDocument) => !(doc.isGenerated && !doc.info))
      .forEach((doc: OrderDocument) => {
        if (doc.isRequired) {
          updatedDocumentTypes.push(doc.typeId)
          updatedDocuments.push(doc)
        } else {
          updatedDocumentTypesOptional.push(doc.typeId)
          updatedDocumentsOptional.push(doc)
        }
      })

    setClientCompanyFounder(stepData?.clientCompanyFounder)
    setClientCompanyQuestionnaire(stepData?.clientCompanyQuestionnaire)
    setDocuments(updatedDocuments)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentTypesOptional(updatedDocumentTypesOptional)
    setDocumentsOptional(updatedDocumentsOptional.length ? updatedDocumentsOptional : null)
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
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<any>).data) // TODO: ask be to generate models
      setOrderStatus((result.data as FrameWizardStepResponse<unknown>).orderStatus as OrderStatus) // TODO: ask be to generate typings
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
    // NOTE: shouldn't be sent cause statuses switches immediately
    const documentStatuses = [
      ...documentsOptional || [],
      ...documents,
    ]
      .filter(document => document.info)
      .map(document => ({
        documentId: document.info?.documentId,
        documentStatus: document.info?.documentStatus ?? DocumentStatus.NotApproved,
      }))
    const result = await sendFrameWizardStep2({
      type: wizardType,
      orderId,
    }, {
      documentStatuses,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
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
      if (currentStep <= sequenceStepNumber) {
        sendNextStep()
      } else {
        setCurrentStep(sequenceStepNumber + 1)
      }
    }
  }

  const handleReject = async (code: number, reason: string) => {
    const result = await frameWizardReject({
      type: wizardType,
      step: sequenceStepNumber,
      orderId,
    }, {
      rejectReasonId: code,
      rejectComment: reason,
    })
    loadStepData()
    return result.success ?? false
  }

  const renderBackButton = () => {
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

  const renderRejectButton = () => {
    return (
      <Button
        danger
        size="large"
        type="default"
        onClick={() => setRejectModalOpened(true)}
      >
        {t('common.actions.reject.title')}
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

  const handleOrderAssign = async () => {
    setSubmitting(true)
    await assignCurrentUser()
    setSubmitting(false)
  }

  const renderAssignOrderButton = () => (
    <Button
      size="large"
      type="primary"
      disabled={submitting}
      onClick={handleOrderAssign}
    >
      {t('orderActions.assign.title')}
    </Button>
  )

  const renderAssignAction = () => (
    <Row className="WizardStep__actions WizardStep__actions--single">
      <Col>{renderAssignOrderButton()}</Col>
    </Row>
  )

  const rejectAllowed = orderStatus && !REJECT_ALLOWED_STATUSES.includes(orderStatus)

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col>{renderBackButton()}</Col>
      <Col>{rejectAllowed && renderRejectButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const changeDocStatus = async (documentId: number, status: DocumentStatus) => {
    const result = await frameWizardSetDocStatus({
      type: wizardType,
      orderId,
    }, {
      documentId,
      documentStatus: status,
    })
    return Boolean(result?.success)
  }

  const renderDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        types={documentTypes || []}
        current={documents}
        onChange={loadStepData}
        setStatusHandler={changeDocStatus}
        readonlyMode={!isCurrentUserAssigned}
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
        current={documentsOptional as OrderDocument[]}
        onChange={loadStepData}
        setStatusHandler={changeDocStatus}
        readonlyMode={!isCurrentUserAssigned}
      />
    </Spin>
  )

  /**
   * Company Founder modal
   */

  const openCompanyFounderModal = () => {
    setCompanyFounderModalVisible(true)
  }

  const closeCompanyFounderModal = () => {
    setCompanyFounderModalVisible(false)
  }

  const renderCompanyFounderSection = () => (
    <Div className="WizardStep__section">
      <Title level={5}>
        {t('orderStepDocuments.companyFounderInformation.title')}
        <Button size="small"
                type="link"
                icon={<SelectOutlined/>}
                onClick={openCompanyFounderModal}
        >
          {t('orderStepDocuments.companyFounderInformation.check')}
        </Button>
      </Title>
      <Modal
        visible={companyFounderModalVisible}
        centered
        width={700}
        bodyStyle={{ paddingTop: '0' }}
        title={t('orderStepDocuments.companyFounderInformation.title')}
        onCancel={closeCompanyFounderModal}
        footer={
          <Button type="primary"
                  onClick={closeCompanyFounderModal}>
            {t('orderStepDocuments.companyFounderInformation.close')}
          </Button>
        }
      >
        <CompanyFounderInfo companyFounder={clientCompanyFounder}/>
      </Modal>
    </Div>
  )

  const renderCompanyQuestionnaireSection = () => (
    <Div className="WizardStep__section">
      <Title level={5}>
        {t('orderStepDocuments.companyQuestionnaire.title')}
        <Button size="small"
                type="link"
                disabled={!dictionaries}
                icon={<SelectOutlined/>}
                onClick={() => setCompanyQuestionnaireModalVisible(true)}
        >
          {t('orderStepDocuments.companyQuestionnaire.check')}
        </Button>
      </Title>
      <Drawer
        width="75VW"
        visible={companyQuestionnaireModalVisible}
        title={t('orderStepDocuments.companyQuestionnaire.title')}
        onClose={() => setCompanyQuestionnaireModalVisible(false)}
      >
        <QuestionnaireForm questionnaireDto={clientCompanyQuestionnaire}
                           dictionaries={dictionaries!}
                           isEditable={false}
        />
      </Drawer>
    </Div>
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
      {renderCompanyFounderSection()}
      {renderCompanyQuestionnaireSection()}
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
      {isCurrentUserAssigned ? renderActions() : renderAssignAction()}
      <RejectOrderModal
        opened={rejectModalOpened}
        setOpened={setRejectModalOpened}
        rejectHandler={handleReject}
      />
    </Div>
  )
}

export default OrderStepDocuments
