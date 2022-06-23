import { useTranslation } from 'react-i18next'
import { Typography, Descriptions, Row, Col, Button } from 'antd'

import Div from 'orient-ui-library/components/Div'

import { OrderWizardType } from 'orient-ui-library/library/models'

import './OrderStepParameters.style.less'

const { Title } = Typography

export interface OrderStepParametersProps {
  orderId?: number
  oprderType?: OrderWizardType
  currentStep: number
  currentStepData: any
  setCurrentStep: (step: number) => void
}

const OrderStepParameters: React.FC<OrderStepParametersProps> = ({
  orderId,
  // oprderType,
  currentStep,
  setCurrentStep,
  currentStepData,
}) => {
  const { t } = useTranslation()

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
        onClick={() => { setCurrentStep(currentStep + 1) }}
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
  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepParameters
