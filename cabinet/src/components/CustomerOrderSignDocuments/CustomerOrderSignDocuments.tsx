import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Button, Skeleton, Spin, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import OrderInfo from 'orient-ui-library/components/OrderInfo'
import OrderDocumentsToSignList from 'components/OrderDocumentsToSignList'

import { OrderStatus } from 'orient-ui-library/library/models/order'
import { FrameWizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { BankDto } from 'orient-ui-library/library/models/proxy'

import { CabinetMode } from 'library/models/cabinet'
import { getFrameWizardStep, sendFrameWizardStep } from 'library/api'

import './CustomerOrderSignDocuments.style.less'

const { Title } = Typography

export interface OrderSignDocumentsProps {
  wizardType?: FrameWizardType
  orderId?: number
  orderStatus?: OrderStatus
  companyId?: number
  customerId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: OrderStatus) => void
}

const CustomerOrderSignDocuments: React.FC<OrderSignDocumentsProps> = ({
  wizardType = FrameWizardType.Simple,
  orderStatus,
  companyId,
  orderId,
  currentStep,
  sequenceStepNumber,
  setCurrentStep,
  setOrderStatus,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to make typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[]>([])
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])
  const [ bankOffer, setBankOffer ] = useState<any>() // TODO: check why not BankOffer
  const [ bank, setBank ] = useState<BankDto>()

  const [ completed, setCompleted ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (currentStep <= sequenceStepNumber) {
      setNextStepAllowed(true)
    }
  }, [ currentStep, sequenceStepNumber ])

  useEffect(() => {
    if (orderStatus === OrderStatus.FRAME_COMPLETED) {
      setCompleted(true)
    }
  }, [ orderStatus ])

  useEffect(() => {
    const currentDocuments = stepData?.documents ?? []
    if (stepData && currentDocuments) {
      updateDocuments(currentDocuments)
    }
    if (stepData?.bankOffers) {
      // NOTE: take the first offer
      // TODO: ask be to change response maybe?
      setBankOffer(stepData.bankOffers[0]?.offer)
      setBank(stepData.bankOffers[0]?.bank)
    }
  }, [ stepData ])

  const updateDocuments = (documents: OrderDocument[]) => {
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []

    documents
      .filter((doc: OrderDocument) => Boolean(doc.info))
      .forEach((doc: OrderDocument) => {
        updatedDocumentTypes.push(doc.typeId)
        updatedDocuments.push(doc)
      })

    setDocuments(updatedDocuments)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentsLoading(false)
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep({
      mode: CabinetMode.Customer,
      type: wizardType,
      step: sequenceStepNumber,
      companyId: companyId as number,
      orderId,
    }, {
      bankId: bankOffer?.bankId,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setOrderStatus(OrderStatus.FRAME_COMPLETED)
      setCompleted(true)
    }
    setSubmitting(false)
  }

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      mode: CabinetMode.Customer,
      type: wizardType,
      companyId: companyId as number,
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<any>).data)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
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

  const renderSubmitButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handleNextStep}
        disabled={!isNextStepAllowed || submitting}
        loading={submitting}
      >
        {t('orders.actions.signAndSubmit.title')}
      </Button>
    )
  }

  const renderNextButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={() => setCurrentStep(sequenceStepNumber + 1)}
      disabled={!isNextStepAllowed || submitting}
    >
      {t('common.actions.next.title')}
    </Button>
  )


  const renderStepActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col>{renderCancelButton()}</Col>
      <Col flex={1}></Col>
      <Col>{currentStep > sequenceStepNumber
        ? renderNextButton()
        : renderSubmitButton()}</Col>
    </Row>
  )

  const renderDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsToSignList
        companyId={companyId as number}
        orderId={orderId as number}
        types={documentTypes}
        current={documents}
        onChange={loadCurrentStepData}
      />
    </Spin>
  )

  const renderOffeSection = () => (
    <Div className="WizardStep__section">
      <Title level={5}>{bank?.name}</Title>
      <OrderInfo
        title={t('frameSteps.signDocuments.sectionTitles.orderConditions')}
        orderId={orderId}
        conditions={bankOffer}
      />
    </Div>
  )

  const renderStepContent = () => (
    <Div className="CustomerOrderSignDocuments">
      <Div className="WizardStep__section">
        <Title level={5}>{completed
          ? t('frameSteps.signDocuments.sectionTitles.documentsArchive')
          : t('frameSteps.signDocuments.sectionTitles.signDocuments')
        }</Title>
        {renderDocuments()}
      </Div>
      {renderOffeSection()}
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
      {!completed && renderStepActions()}
    </Div>
  )
}

export default CustomerOrderSignDocuments
