import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Col, Row, Skeleton, Spin, Typography } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { FactoringStatus } from 'orient-ui-library/library'

import OrderDocumentsList from 'components/OrderDocumentsList'

import { getFactoringWizardStep, sendFactoringWizardStep } from 'library/api/factoringWizard'

import './FactoringStepArchive.style.less'

const { Title } = Typography

export interface OrderDocumentsProps {
  bankId?: number | bigint
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: FactoringStatus) => void,
  completed?: boolean
}

const FactoringStepArchive: React.FC<OrderDocumentsProps> = ({
  bankId,
  orderId,
  currentStep,
  sequenceStepNumber,
  setOrderStatus,
}) => {
  const { t } = useTranslation()

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate models
  const [ factoringStatus, setFactoringStatus ] = useState<FactoringStatus>()
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])

  useEffect(() => {
    loadStepData()
  }, [ currentStep ])

  useEffect(() => {
    if (!stepData) return
    const currentDocuments = stepData?.documents ?? []
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []

    currentDocuments
      .filter((doc: OrderDocument) => Boolean(doc.info))
      .forEach((doc: OrderDocument) => {
        updatedDocumentTypes.push(doc.typeId)
        updatedDocuments.push(doc)
      })

    setDocuments(updatedDocuments)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentsLoading(false)
  }, [ stepData ])

  const loadStepData = async () => {
    if (documentTypes === null) {
      // NOTE: do not show loader every time updates
      setDocumentsLoading(true)
    }
    const result = await getFactoringWizardStep({
      step: sequenceStepNumber,
      bankId: bankId as number,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<any>).data) // TODO: ask be to generate models
      setFactoringStatus((result.data as FrameWizardStepResponse<any>).orderStatus as FactoringStatus)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const handleNextStep = async () => {
    if (!orderId) {
      return
    }
    setSubmitting(true)
    let nextStepNumber: number
    let nextStatus: FactoringStatus | null
    switch (factoringStatus) {
      case FactoringStatus.FACTOR_WAIT_FOR_CHARGE:
        nextStepNumber = sequenceStepNumber
        nextStatus = FactoringStatus.FACTOR_CHARGED
        break
      case FactoringStatus.FACTOR_CHARGED:
        nextStepNumber = sequenceStepNumber // NOTE: for a some reason it's the same step
        nextStatus = FactoringStatus.FACTOR_COMPLETED
        break
      case FactoringStatus.FACTOR_COMPLETED:
      default:
        nextStatus = null
        nextStepNumber = 0
        break
    }
    const result = await sendFactoringWizardStep({
      step: nextStepNumber,
      bankId: bankId as number,
      orderId,
    }, undefined)
    if (result.success) {
      nextStatus && setFactoringStatus(nextStatus)
      nextStatus && setOrderStatus(nextStatus)
      loadStepData()
    }
    setSubmitting(false)
  }

  const renderDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        types={documentTypes || []}
        current={documents}
      />
    </Spin>
  )

  const renderStepContent = () => (
    <Div className="FactoringStepArchive">
      <Div className="WizardStep__section">
        <Title level={5}>{t('orderStepArchive.docsSectionTitle')}</Title>
        {renderDocuments()}
      </Div>
    </Div>
  )

  const getNextButtonText = () => {
    switch (factoringStatus) {
      case FactoringStatus.FACTOR_WAIT_FOR_CHARGE:
        return t('orderStepArchive.actions.supplierCharged.title')
      case FactoringStatus.FACTOR_CHARGED:
        return t('orderStepArchive.actions.chargeExtinguished.title')
      default:
        return null
    }
  }
  const renderNextButton = () => {
    const buttonText = getNextButtonText()
    if (buttonText === null) return <></>

    return (
      <Button
        size="large"
        type="primary"
        onClick={handleNextStep}
        loading={submitting}
      >
        {buttonText}
      </Button>
    )
  }

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col flex={1}/>
      <Col>{renderNextButton()}</Col>
    </Row>
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

export default FactoringStepArchive
