import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sortBy } from 'lodash'

import { Button, Col, message, Modal, Row, Skeleton, Spin, Typography } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { FactoringStatus } from 'orient-ui-library/library'

import OrderDocumentsList from 'components/OrderDocumentsList'
import RejectOrderModal from 'components/RejectOrderModal'
import { FACTORING_REJECTION_ALLOWED_STATUSES } from 'library/models/factoringWizard'
import { DocumentStatus } from 'library/models'

import {
  factoringWizardSetDocStatus,
  getFactoringWizardStep,
  sendFactoringWizardStep,
  rejectFactoringOrder,
} from 'library/api/factoringWizard'

import './FactoringStepDocuments.style.less'
import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'
import CompanyFounderInfo from 'orient-ui-library/components/CompanyFounderInfo'

const { Title } = Typography

export interface FactoringStepDocumentsProps {
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: FactoringStatus) => void
  orderStatus?: FactoringStatus
  isCurrentUserAssigned: boolean
  assignCurrentUser: () => Promise<unknown>
}

const FactoringStepDocuments: React.FC<FactoringStepDocumentsProps> = ({
  orderId,
  currentStep,
  sequenceStepNumber,
  setCurrentStep,
  setOrderStatus,
  orderStatus,
  isCurrentUserAssigned,
  assignCurrentUser,
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
  const [ documentTypesOptional, setDocumentTypesOptional ] = useState<number[]>()
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])
  const [ documentsOptional, setDocumentsOptional ] = useState<OrderDocument[] | null>()

  const [ clientCompanyFounder, setClientCompanyFounder ] = useState<CompanyFounderDto | null>(null)
  const [ companyFounderModalVisible, setCompanyFounderModalVisible ] = useState<boolean>(false)

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
    const result = await getFactoringWizardStep({
      step: sequenceStepNumber,
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
    const result = await sendFactoringWizardStep({
      step: sequenceStepNumber,
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
    const result = await rejectFactoringOrder({
      step: sequenceStepNumber,
      orderId: orderId as number,
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

  const rejectAllowed = orderStatus && !FACTORING_REJECTION_ALLOWED_STATUSES.includes(orderStatus)

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col>{renderBackButton()}</Col>
      <Col>{rejectAllowed && renderRejectButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const changeDocStatus = async (documentId: number, status: DocumentStatus) => {
    const result = await factoringWizardSetDocStatus({
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
            {t('models.bankRequisites.close')}
          </Button>
        }
      >
        <CompanyFounderInfo companyFounder={clientCompanyFounder}/>
      </Modal>
    </Div>
  )

  const renderStepContent = () => (
    <Div className="FactoringStepDocuments">
      <Div className="FactoringStepDocuments__title">
        <Title level={4}>{t('orderStepDocuments.title')}</Title>
      </Div>
      <Div className="WizardStep__section">
        <Title level={5}>{t('orderStepDocuments.sectionTitles.mainDocs')}</Title>
        {renderDocuments()}
      </Div>
      {documentsOptional !== null && renderOptionalDocumentsSection()}
      {renderCompanyFounderSection()}
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

export default FactoringStepDocuments
