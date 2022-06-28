import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Button, Result, Skeleton, List, Spin, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { OrderStatus } from 'orient-ui-library/library/models/order'
import { WizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderDocument } from 'orient-ui-library/library/models/proxy'
import { Bank } from 'library/models/bank' // TODO: to ui-lib

import OrderDocumentsToSignList from 'components/OrderDocumentsToSignList'

import { getFrameWizardStep, sendFrameWizardStep3 } from 'library/api'

import './OrderStepSignDocuments.style.less'

const { Title } = Typography
const { Item: ListItem } = List

export interface OrderSignDocumentsProps {
  wizardType?: FrameWizardType
  orderId?: number
  orderStatus?: OrderStatus
  companyId?: number
  customerId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepSignDocuments: React.FC<OrderSignDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  orderStatus,
  companyId,
  orderId,
  currentStep,
  sequenceStepNumber,
  setCurrentStep,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ isVerifying, setIsVerifying ] = useState<boolean>()
  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to make typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[]>([])
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])
  const [ documentTypesAutoGenerated, setDocumentTypesAutoGenerated ] = useState<number[] | null>(null)
  const [ documentsAutoGenerated, setDocumentsAutoGenerated ] = useState<OrderDocument[]>([])

  useEffect(() => {
    setIsVerifying(orderStatus === OrderStatus.FRAME_OPERATOR_WAIT_FOR_VERIFY)
  }, [orderStatus])

  useEffect(() => {
    setNextStepAllowed(!isVerifying)
    if (!isVerifying) {
      loadCurrentStepData()
    }
  }, [isVerifying])

  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      setNextStepAllowed(true)
    }
  }, [currentStep, sequenceStepNumber])

  useEffect(() => {
    const currentDocuments = stepData?.documents ?? []
    if (stepData && currentDocuments) {
      updateDocuments(currentDocuments)
    }
  }, [stepData])


  const updateDocuments = (documents: OrderDocument[]) => {
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentsAutoGenerated: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []
    const updatedDocumentTypesAutoGenerated: number[] = []

    documents.forEach((doc: OrderDocument) => {
      if (!doc.isGenerated) {
        updatedDocumentTypes.push(doc.typeId)
        updatedDocuments.push(doc)
      } else {
        updatedDocumentTypesAutoGenerated.push(doc.typeId)
        updatedDocumentsAutoGenerated.push(doc)
      }
    })

    setDocuments(updatedDocuments)
    setDocumentsAutoGenerated(updatedDocumentsAutoGenerated)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentTypesAutoGenerated(updatedDocumentTypesAutoGenerated)
    setDocumentsLoading(false)
}

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep3({
      type: wizardType,
      companyId: companyId as number,
      orderId,
    }, {

    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setCurrentStep(sequenceStepNumber + 1)
    }
    setSubmitting(false)
  }

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      type: wizardType,
      companyId: companyId as number,
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as WizardStepResponse<any>).data)
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

  const renderRejectButton = () => (
    <Button
      danger
      size="large"
      type="default"
    >
      {t('frameSteps.signDocuments.actions.reject.title')}
    </Button>
  )

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

  const renderWaitActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col>{renderRejectButton()}</Col>
    </Row>
  )

  const renderWaitMessage = () => (
    <Result
      title={t('frameSteps.signDocuments.waitForOperator.title')}
      subTitle={t('frameSteps.signDocuments.waitForOperator.desc')}
    />
  )

  const renderDocuments = () =>  (
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

  const renderAutoGeneratedDocumentsSection = () => (
    <Div className="OrderStepSignDocuments__section">
      <Title level={5}>{t('frameSteps.signDocuments.sectionTitles.autoGeneratedDocs')}</Title>
      {renderAutoGeneratedDocuments()}
    </Div>
  )

  const renderAutoGeneratedDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsToSignList
        companyId={companyId as number}
        orderId={orderId as number}
        types={documentTypesAutoGenerated || []}
        current={documentsAutoGenerated}
        onChange={loadCurrentStepData}
      />
    </Spin>
  )

  const renderBanksListSection = () => (
    <Div className="OrderStepSignDocuments__section">
      <Title level={5}>{t('frameSteps.signDocuments.sectionTitles.banksForSending')}</Title>
      {renderBanksList()}
    </Div>
  )

  const renderBanksList = () => (
    <List>
      {stepData?.banks?.map((bank: Bank) => (
        <ListItem id={String(bank.bankId)}>
          {bank.bankName}
        </ListItem>
      ))}
    </List>
  )

  const renderStepContent = () => (
    <Div className="OrderStepSignDocuments">
      <Div className="OrderStepSignDocuments__section">
        <Title level={5}>{t('frameSteps.signDocuments.sectionTitles.signDocuments')}</Title>
        {renderDocuments()}
      </Div>
      {documentTypesAutoGenerated !== null && renderAutoGeneratedDocumentsSection}
      <Div className="OrderStepSignDocuments__section">
        <Title level={5}>{t('frameSteps.signDocuments.sectionTitles.autoGeneratedDocs')}</Title>
        {renderDocuments()}
      </Div>
      {currentStep === sequenceStepNumber && renderBanksListSection}
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
      {isVerifying ? renderWaitMessage() : renderStepContent()}
      {isVerifying ? renderWaitActions() : renderStepActions()}
    </Div>
  )
}

export default OrderStepSignDocuments
