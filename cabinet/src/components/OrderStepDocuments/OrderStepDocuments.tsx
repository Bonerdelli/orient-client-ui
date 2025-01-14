import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { every, sortBy } from 'lodash'

import { Button, Col, message, Row, Skeleton, Spin, Typography } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { OrderDocument } from 'orient-ui-library/library/models/document'
import { FrameWizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderStatus } from 'orient-ui-library/library/models/order'

import OrderDocumentsList from 'components/OrderDocumentsList'
import CompanyDataReadyStatuses from 'components/CompanyDataReadyStatuses'
import {
  BankRequisitesTableData,
  companyDataInitialStatus,
} from 'components/CompanyDataReadyStatuses/CompanyDataReadyStatuses'

import {
  getCompanyRequisitesList,
  getFrameWizardStep,
  saveRequisitesToOrder,
  sendFrameWizardStep2,
  WizardStep2Data,
} from 'library/api'

import './OrderStepDocuments.style.less'
import { CompanyRequisitesDto } from 'orient-ui-library/library/models/proxy'
import { CabinetMode } from 'library/models/cabinet'

const { Title } = Typography

export interface OrderDocumentsProps {
  wizardType?: FrameWizardType
  companyId?: number
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: OrderStatus) => void
  orderStatus?: OrderStatus
}

const requisitesStateStorageKey = 'or-draftOrderRequisitesState'

const OrderStepDocuments: React.FC<OrderDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  currentStep,
  sequenceStepNumber,
  setCurrentStep,
  setOrderStatus,
  orderStatus,
}) => {
  const { t } = useTranslation()
  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<WizardStep2Data>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>(true)
  const [ companyDataStatus, setCompanyDataStatus ] = useState({ ...companyDataInitialStatus })
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[]>([])
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])
  const [ documentTypesOptional, setDocumentTypesOptional ] = useState<number[] | null>(null)
  const [ documentsOptional, setDocumentsOptional ] = useState<OrderDocument[]>([])

  const [ requisitesList, setRequisitesList ] = useState<BankRequisitesTableData[]>([])
  const [ selectedRequisitesId, setSelectedRequisitesId ] = useState<number | undefined>()

  useEffect(() => {
    loadCurrentStepData()
    if (orderStatus === OrderStatus.FRAME_DRAFT) {
      loadCompanyBankRequisites()
    }
  }, [])

  useEffect(() => {
    let isAllDocumentsReady = true
    const currentDocuments = stepData?.documents ?? []
    if (stepData && currentDocuments) {
      isAllDocumentsReady = updateCurrentDocuments(currentDocuments)
    }


    let bankRequisitesState
    if (orderStatus === OrderStatus.FRAME_DRAFT) {
      const storedValue = localStorage.getItem(requisitesStateStorageKey)
      if (storedValue !== null) {
        const { orderId: storedOrderId, requisitesId } = JSON.parse(storedValue)
        if (orderId === storedOrderId) {
          bankRequisitesState = true
          setSelectedRequisitesId(requisitesId)
        } else {
          localStorage.removeItem(requisitesStateStorageKey)
        }
      } else {
        bankRequisitesState = false
      }
    } else {
      bankRequisitesState = Boolean(stepData?.requisites)
      setSelectedRequisitesId(stepData?.requisites?.id)
    }

    const updatedCompanyStatus = {
      companyHead: Boolean(stepData?.founder),
      bankRequisites: bankRequisitesState,
      questionnaire: wizardType === FrameWizardType.Simple || Boolean(stepData?.questionnaire),
    }

    const isCompanyDataReady = every(updatedCompanyStatus, Boolean)
    setNextStepAllowed(isAllDocumentsReady && isCompanyDataReady)
    setCompanyDataStatus(updatedCompanyStatus)
  }, [ stepData ])

  const updateCurrentDocuments = (documents: OrderDocument[]): boolean => {
    let isAllDocumentsReady = true
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentsOptional: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []
    const updatedDocumentTypesOptional: number[] = []

    sortBy(documents, 'priority')
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
    if (documentTypes === null) {
      // NOTE: do not show loader every time updates
      setDocumentsLoading(true)
    }
    const result = await getFrameWizardStep({
      type: wizardType,
      companyId: companyId as number,
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<WizardStep2Data>).data)
      setOrderStatus((result.data as FrameWizardStepResponse<WizardStep2Data>).orderStatus as OrderStatus)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const loadCompanyBankRequisites = async () => {
    if (!companyId) return

    const res = await getCompanyRequisitesList({ companyId })
    if (res.success) {
      const list = res.data?.map(requisites => ({ ...requisites, key: requisites.id! })) ?? []
      setRequisitesList(list)
    }
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
      setNextStepAllowed(false)
    } else {
      setOrderStatus(OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY)
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
    if (currentStep === sequenceStepNumber) {
      sendNextStep()
    } else {
      setCurrentStep(sequenceStepNumber + 1)
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
    <Row className="WizardStep__actions">
      <Col>{renderCancelButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const renderDocuments = () => (
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

  const renderOptionalDocumentsSection = () => (
    <Div className="WizardStep__section">
      <Title level={5}>{t('frameSteps.documents.sectionTitles.additionalDocs')}</Title>
      {renderOptionalDocuments()}
    </Div>
  )

  const renderOptionalDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        companyId={companyId as number}
        orderId={orderId as number}
        types={documentTypesOptional || []}
        current={documentsOptional}
        onChange={loadCurrentStepData}
      />
    </Spin>
  )

  const handleSaveRequisites = async (requisites: CompanyRequisitesDto) => {
    const res = await saveRequisitesToOrder({
      mode: CabinetMode.Client,
      type: wizardType,
      orderId: orderId!,
      companyId: companyId!,
      requisitesId: requisites.id!,
    })
    if (res.success) {
      loadCurrentStepData()
      setSelectedRequisitesId(requisites.id)
      setCompanyDataStatus({
        ...companyDataStatus,
        bankRequisites: true,
      })
      if (orderStatus === OrderStatus.FRAME_DRAFT) {
        const strValue = JSON.stringify({ orderId, requisitesId: requisites.id! })
        localStorage.setItem(requisitesStateStorageKey, strValue)
      }
    }
  }

  const renderStepContent = () => (
    <Div className="OrderStepDocuments">
      <Div className="OrderStepDocuments__title">
        <Title level={4}>{t('frameSteps.documents.title')}</Title>
      </Div>
      <Div className="WizardStep__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.mainDocs')}</Title>
        {renderDocuments()}
      </Div>
      {documentTypesOptional !== null && renderOptionalDocumentsSection}
      <Div className="WizardStep__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.companyData')}</Title>
        <CompanyDataReadyStatuses
          wizardType={wizardType}
          companyDataStatus={companyDataStatus}
          onSaveRequisites={handleSaveRequisites}
          selectedRequisitesId={selectedRequisitesId}
          founderId={stepData?.founder?.id}
          requisitesList={requisitesList}
        />
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
      {renderActions()}
    </Div>
  )
}

export default OrderStepDocuments
