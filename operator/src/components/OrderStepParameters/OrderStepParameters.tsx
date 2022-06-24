import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Descriptions, Row, Col, Button, Skeleton, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { OrderWizardType } from 'orient-ui-library/library/models/order'
import { WizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { getFrameWizardStep, sendFrameWizardStep1 } from 'library/api/frameWizard'

import './OrderStepParameters.style.less'


export interface OrderStepParametersProps {
  orderId?: number
  orderType?: OrderWizardType
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepParameters: React.FC<OrderStepParametersProps> = ({
  orderId,
  // orderType,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setIsNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setIsPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<unknown>() // TODO: ask be to make typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as WizardStepResponse<unknown>).data) // TODO: ask be to make typings
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
    setIsNextStepAllowed(true) // NOTE: only for debugging
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep1({
      orderId,
    }, {})
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setIsNextStepAllowed(false)
    } else {
      setCurrentStep(sequenceStepNumber + 1)
    }
    setSubmitting(false)
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const renderNextButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        disabled={submitting}
        onClick={handleNextStep}
      >
        Взять на проверку
      </Button>
    )
  }

  const renderOrderInfo = () => (
    <Descriptions title="Заявка" bordered column={1}>
      <Descriptions.Item label="Номер заявки">
        {orderId}
      </Descriptions.Item>
      <Descriptions.Item label="ИНН Заказчика">
        {currentStepData.customerCompany.inn}
      </Descriptions.Item>
      <Descriptions.Item label="Наименование Заказчика">
        {currentStepData.customerCompany.shortName}
      </Descriptions.Item>
    </Descriptions>
  )

  const renderCompanyInfo = () => (
    <Descriptions title="Клиент" bordered column={1}>
      <Descriptions.Item label="Клиент">
        {currentStepData.clientCompany.shortName}
      </Descriptions.Item>
      <Descriptions.Item label="Наименование юридического лица">
        {currentStepData.clientCompany.fullName}
      </Descriptions.Item>
      <Descriptions.Item label="Номер заявки">
        {orderId}
      </Descriptions.Item>
      <Descriptions.Item label="ИНН">
        {currentStepData.clientCompany.inn}
      </Descriptions.Item>
      <Descriptions.Item label="ИНН Заказчика">
        {currentStepData.customerCompany.inn}
      </Descriptions.Item>
      <Descriptions.Item label="Код ОПФ">
        {currentStepData.customerCompany.opf}
      </Descriptions.Item>
      <Descriptions.Item label="Наименование Заказчика">
        {currentStepData.customerCompany.shortName}
      </Descriptions.Item>
      <Descriptions.Item label="Принадлежность к МСП">
        Нет
      </Descriptions.Item>
      <Descriptions.Item label="Уставный фонд">
        {/* currentStepData.clientCompany */}
      </Descriptions.Item>
      <Descriptions.Item label="Код ОКЭД">
        {currentStepData.customerCompany.oked}
      </Descriptions.Item>
      <Descriptions.Item label="Код СООГУ">
        {currentStepData.customerCompany.soogu}
      </Descriptions.Item>
      <Descriptions.Item label="Состояние активности">
        {/* currentStepData.clientCompany */}
      </Descriptions.Item>
      <Descriptions.Item label="Действующие предприятия">
        {/* currentStepData.clientCompany */}
      </Descriptions.Item>
      <Descriptions.Item label="Код СОАТО">
        {currentStepData.customerCompany.soato}
      </Descriptions.Item>
      <Descriptions.Item label="Адрес">
        {currentStepData.customerCompany.address}
      </Descriptions.Item>
      <Descriptions.Item label="Руководитель">
        {currentStepData.clientCompanyFounder.firstName}
        {currentStepData.clientCompanyFounder.lastName}
      </Descriptions.Item>
      <Descriptions.Item label="Выписка ЕГРПО">
        {/* currentStepData.clientCompany */}
      </Descriptions.Item>
    </Descriptions>
  )

  const renderStepContent = () => (
    <Div className="OrderStepParameters">
      <Row gutter={12}>
        <Col span={12}>{renderCompanyInfo()}</Col>
        <Col span={12}>{renderOrderInfo()}</Col>
      </Row>
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
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepParameters
