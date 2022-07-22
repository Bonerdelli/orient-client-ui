import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { sortBy } from 'lodash'

import { Typography, Row, Col, Button, Skeleton, Result, message } from 'antd'
import { ClockCircleFilled } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { FactoringStatus } from 'orient-ui-library/library/models/order'

import { CabinetMode } from 'library/models/cabinet'
import { getFactoringWizardStep, sendFactoringWizardStep } from 'library/api/factoringWizard'
import { FACTORING_CUSTOMER_COMPLETED_STATUSES } from 'components/FactoringCustomerWizard'
import OrderDocumentsToSignList from 'components/OrderDocumentsToSignList'

import './CustomerFactoringSignDocuments.style.less'

const { Title } = Typography

export interface CustomerFactoringSignDocumentsProps {
  companyId: number
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: FactoringStatus) => void
  orderStatus?: FactoringStatus,
  completed?: boolean,
}

const CustomerFactoringSignDocuments: React.FC<CustomerFactoringSignDocumentsProps> = ({
  companyId,
  orderId,
  setCurrentStep,
  sequenceStepNumber,
  setOrderStatus,
  orderStatus,
  completed,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (orderStatus &&
        !FACTORING_CUSTOMER_COMPLETED_STATUSES.includes(orderStatus) &&
        orderStatus !== FactoringStatus.FACTOR_BANK_SIGN) {
      setNextStepAllowed(true)
    }
  }, [ orderStatus ])

  useEffect(() => {
    const currentDocuments = stepData?.documents ?? []
    const updatedDocumentTypes: number[] = []
    sortBy(currentDocuments, 'priority')
      .forEach((doc: OrderDocument) => {
        if (doc.info && !doc.isGenerated) {
          updatedDocumentTypes.push(doc.typeId)
        }
      })
    setDocumentTypes(updatedDocumentTypes)
  }, [ stepData ])

  const isWaitingForBank = orderStatus === FactoringStatus.FACTOR_BANK_SIGN

  const loadCurrentStepData = async () => {
    const result = await getFactoringWizardStep({
      mode: CabinetMode.Customer,
      step: sequenceStepNumber,
      companyId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<unknown>).data) // TODO: ask be to generate typings
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFactoringWizardStep({
      mode: CabinetMode.Customer,
      step: sequenceStepNumber,
      companyId,
      orderId,
    }, undefined)
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setOrderStatus(FactoringStatus.FACTOR_BANK_SIGN)
      loadCurrentStepData()
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

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col flex={1}>{renderPrevButton()}</Col>
      <Col>{!isWaitingForBank && renderSubmitButton()}</Col>
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
      {t('common.actions.sign.title')}
    </Button>
  )

  const renderPrevButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handlePrevStep}
    >
      {t('common.actions.back.title')}
    </Button>
  )

  const renderDocuments = () =>  (
    <OrderDocumentsToSignList
      companyId={companyId}
      orderId={orderId as number}
      types={documentTypes || []}
      current={stepData?.documents || []}
      checkSignedFn={document => document.info?.customerSigned === true}
    />
  )

  const renderStepContent = () => (
    <Div className="CustomerFactoringSignDocuments">
      <Title level={5}>{orderStatus === FactoringStatus.FACTOR_CUSTOMER_SIGN
        ? t('customerOrderStepDocuments.sections.documentsForSign.title')
        : t('customerOrderStepDocuments.sections.documentsList.title')}
      </Title>
      {renderDocuments()}
    </Div>
  )

  const renderWaitMessage = () => (
    <Result
      icon={<ClockCircleFilled />}
      title={t('orderStepBankOffer.statuses.waitingForBank.title')}
    />
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
      {isWaitingForBank && renderWaitMessage()}
      {renderStepContent()}
      {!completed && renderActions()}
    </Div>
  )
}

export default CustomerFactoringSignDocuments
