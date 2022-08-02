import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sortBy } from 'lodash'

import { Button, Col, message, Row, Skeleton, Spin, Typography } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import OrderCondition from 'orient-ui-library/components/OrderCondition'
import { OrderConditions } from 'orient-ui-library/library/models/orderCondition'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import { checkDocumentSigned, checkDocumentSignNeeded } from 'orient-ui-library/library/helpers/order'

import OrderDocumentsList from 'components/OrderDocumentsList'

import { getFrameWizardStep, sendFrameWizardStep } from 'library/api/frameWizard'

import './OrderStepContractDocuments.style.less'

const { Title } = Typography

export interface OrderStepContractDocumentsProps {
  bankId?: number | bigint
  orderId?: number
  offerStatus?: BankOfferStatus
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOfferStatus: (step: BankOfferStatus) => void
  isCurrentUserAssigned: boolean
  assignCurrentUser: () => Promise<unknown>
}

const DOCUMENTS_TO_SHOW = [
  9, // Рамочный договор
  17, // Индивидуальные условия
]

const OrderStepContractDocuments: React.FC<OrderStepContractDocumentsProps> = ({
  bankId,
  orderId,
  offerStatus,
  currentStep,
  setCurrentStep,
  setOfferStatus,
  sequenceStepNumber,
  isCurrentUserAssigned,
  assignCurrentUser,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ orderConditions, setOrderConditions ] = useState<OrderConditions>()
  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])
  const [ isAccepted, setAccepted ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (stepData?.conditions) {
      setOrderConditions(stepData.conditions)
    }
  }, [ stepData ])

  useEffect(() => {
    if (offerStatus) {
      setAccepted(offerStatus === BankOfferStatus.Completed)
    }
  }, [ offerStatus ])

  useEffect(() => {
    if (!stepData) return
    const currentDocuments = stepData?.documents ?? []
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []

    sortBy(currentDocuments, 'priority')
      .filter((doc: OrderDocument) => DOCUMENTS_TO_SHOW.includes(doc.typeId))
      .forEach((doc: OrderDocument) => {
        if (doc.info) {
          updatedDocumentTypes.push(doc.typeId)
          updatedDocuments.push(doc)
        }
      })

    setDocuments(updatedDocuments)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentsLoading(false)
  }, [ stepData ])

  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      // NOTE: only for debugging
      setNextStepAllowed(true)
    }
  }, [ currentStep, sequenceStepNumber ])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      step: sequenceStepNumber,
      bankId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<unknown>).data) // TODO: ask be to generate typings
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
    setNextStepAllowed(true) // NOTE: only for debugging
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep({
      step: sequenceStepNumber,
      bankId,
      orderId,
    }, undefined)
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setOfferStatus(BankOfferStatus.BankOfferSent)
      setCurrentStep(sequenceStepNumber + 1)
    }
    setSubmitting(false)
  }

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(sequenceStepNumber - 1)
    }
  }

  const handleStepSubmit = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      setCurrentStep(sequenceStepNumber + 1)
    }
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
      {t('orderActions.take.title')}
    </Button>
  )

  const renderActions = () => {
    const actions = () => (<>
      <Col flex={1}></Col>
      <Col>{currentStep > sequenceStepNumber
        ? renderNextButton()
        : renderSubmitButton()}</Col>
    </>)

    return (
      <Row justify="center">
        {isCurrentUserAssigned ? actions() : renderAssignOrderButton()}
      </Row>
    )
  }

  const renderSubmitButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handleStepSubmit}
      disabled={!isNextStepAllowed || submitting}
      loading={submitting}
    >
      {t('orderStepContractDocuments.actions.submit.title')}
    </Button>
  )

  const renderNextButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handleNextStep}
      disabled={!isNextStepAllowed || submitting}
    >
      {t('common.actions.next.title')}
    </Button>
  )

  // NOTE: disabled as we can't go back by status model
  const renderPrevButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handlePrevStep}
      disabled={true}
    >
      {t('orderStepContractDocuments.actions.back.title')}
    </Button>
  )

  const renderDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        checkSignNeededFn={checkDocumentSignNeeded}
        checkSignedFn={checkDocumentSigned}
        types={documentTypes || []}
        current={documents}
      />
    </Spin>
  )

  const renderStepContent = () => (
    <Div className="OrderStepContractDocuments">
      <Row className="WizardStep__section">
        <Col span={24} xl={12}>
          <OrderCondition condition={orderConditions}/>
        </Col>
      </Row>
      <Div className="WizardStep__section">
        <Title level={5}>{t('orderStepContractDocuments.title')}</Title>
        {renderDocuments()}
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

export default OrderStepContractDocuments
