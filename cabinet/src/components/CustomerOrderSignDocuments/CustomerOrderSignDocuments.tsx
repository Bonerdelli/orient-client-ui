import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Button, Result, Skeleton, List, Spin, message } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import OrderInfo from 'orient-ui-library/components/OrderInfo'

import { OrderStatus } from 'orient-ui-library/library/models/order'
import { FrameWizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { Bank } from 'library/models/bank' // TODO: to ui-lib

import OrderDocumentsToSignList from 'components/OrderDocumentsToSignList'

import { getFrameWizardStep, sendFrameWizardStep3 } from 'library/api'

import './CustomerOrderSignDocuments.style.less'

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
  setOrderStatus: (status: OrderStatus) => void
}

const CustomerOrderSignDocuments: React.FC<OrderSignDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
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
  const [ completed, setCompleted ] = useState<>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[]>([])
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])

  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      setNextStepAllowed(true)
    }
  }, [ currentStep, sequenceStepNumber ])

  useEffect(() => {
    const currentDocuments = stepData?.documents ?? []
    if (stepData && currentDocuments) {
      updateDocuments(currentDocuments)
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
    const result = await sendFrameWizardStep3({
      type: wizardType,
      step: sequenceStepNumber,
      companyId: companyId as number,
      orderId,
    }, {})
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
      setStepData((result.data as FrameWizardStepResponse<any>).data)
      setOrderStatus((result.data as FrameWizardStepResponse<any>).orderStatus as OrderStatus)
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
    <Div className="CustomerOrderSignDocuments__section">
      <Title level={5}></Title>
      <OrderInfo
        orderId={orderId}
        conditions={stepData?.offer?.conditions}
        customerCompany={stepData?.customerCompany}
      />
    </Div>
  )

  const renderStepContent = () => (
    <Div className="CustomerOrderSignDocuments">
      <Div className="CustomerOrderSignDocuments__section">
        <Title level={5}>{t('frameSteps.signDocuments.sectionTitles.signDocuments')}</Title>
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
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderStepActions()}
    </Div>
  )
}

export default CustomerOrderSignDocuments
