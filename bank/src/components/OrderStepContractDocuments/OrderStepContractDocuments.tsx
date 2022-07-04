import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Button, Skeleton, Spin, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import OrderCondition from 'orient-ui-library/components/OrderCondition'
import { OrderConditions } from 'orient-ui-library/library/models/orderCondition'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { WizardStepResponse } from 'orient-ui-library/library/models/wizard'

import OrderDocumentsList from 'components/OrderDocumentsList'

import {
  getFrameWizardStep,
  sendFrameWizardStep,
} from 'library/api/frameWizard'

import './OrderStepContractDocuments.style.less'

const { Title } = Typography

export interface OrderStepContractDocumentsProps {
  bankId?: number | bigint
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepContractDocuments: React.FC<OrderStepContractDocumentsProps> = ({
  bankId,
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
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

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (stepData?.conditions) {
      setOrderConditions(stepData.conditions)
    }
  }, [stepData])

  useEffect(() => {
    if (!stepData) return
    const currentDocuments = stepData?.documents ?? []
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []

    currentDocuments.forEach((doc: OrderDocument) => {
      if (doc.isGenerated && doc.info) {
        updatedDocumentTypes.push(doc.typeId)
        updatedDocuments.push(doc)
      }
    })

    setDocuments(updatedDocuments)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentsLoading(false)
  }, [stepData])

  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      // NOTE: only for debugging
      setNextStepAllowed(true)
    }
  }, [currentStep, sequenceStepNumber])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      step: sequenceStepNumber,
      bankId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as WizardStepResponse<unknown>).data) // TODO: ask be to generate typings
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
      // NOTE: workaround requested by be, send next step after current
      const result = await sendFrameWizardStep({
        step: sequenceStepNumber + 1,
        bankId,
        orderId,
      }, undefined)
      if (!result.success) {
        message.error(t('common.errors.requestError.title'))
        setNextStepAllowed(false)
      } else {
        setCurrentStep(sequenceStepNumber + 1)
      }
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
      sendNextStep()
    }
  }

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col flex={1}>{renderPrevButton()}</Col>
      <Col>{currentStep > sequenceStepNumber
        ? renderNextButton()
        : renderSubmitButton()}</Col>
    </Row>
  )

  const renderSubmitButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handleStepSubmit}
      disabled={!isNextStepAllowed || submitting}
      loading={submitting}
    >
      {t('common.actions.saveAndContinue.title')}
    </Button>
  )

  const renderNextButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handleNextStep}
      disabled={!isNextStepAllowed || submitting}
    >
      {t('orderActions.saveAndContinue.title')}
    </Button>
  )

  // NOTE: disabled as we can't go back by status model
  const renderPrevButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handlePrevStep}
      disabled={true}
      loading={submitting}
    >
      {t('orderStepContractDocuments.actions.back.title')}
    </Button>
  )

  const renderDocuments = () =>  (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        types={documentTypes || []}
        current={documents}
      />
    </Spin>
  )

  const renderStepContent = () => (
    <Div className="OrderStepContractDocuments">
      <Div className="WizardStep__section">
        <OrderCondition condition={orderConditions} />
      </Div>
      <Div className="WizardStep__section">
        <Title level={5}>{t('orderStepContractDocuments.title')}</Title>
        {renderDocuments()}
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
    <Div className="WizardStep__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepContractDocuments
