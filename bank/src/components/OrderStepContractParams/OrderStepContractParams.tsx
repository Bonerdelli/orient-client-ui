import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Typography, Row, Col, Button, Input, DatePicker, Select, Skeleton, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { WizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { OrderTerms, OrderTermCondition } from 'orient-ui-library/library/models/orderTerms'

import {
  getFrameWizardStep,
  sendFrameWizardStep2,
} from 'library/api/frameWizard'

import './OrderStepContractParams.style.less'

const { Title } = Typography
const { Item: FormItem } = Form
const { Option } = Select

export interface OrderStepContractParamsProps {
  bankId?: number | bigint
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepContractParams: React.FC<OrderStepContractParamsProps> = ({
  bankId,
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<unknown>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ termCondition, setTermCondition ] = useState<OrderTermCondition>()
  const [ formData, setFormData ] = useState<Partial<OrderTerms>>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

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
    setNextStepAllowed(true)
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep2({
      bankId,
      orderId,
    }, {
      conditions: formData,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
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
    if (isNextStepAllowed) {
      setCurrentStep(sequenceStepNumber + 1)
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
      htmlType="submit"
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

  const renderPrevButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handlePrevStep}
      disabled={submitting}
      loading={submitting}
    >
      {t('common.actions.back.title')}
    </Button>
  )

  const handleFormSubmit = async (data: OrderTerms) => {
    setFormData(data)
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const isComission = () => termCondition === OrderTermCondition.Comission
  const isDiscount = () => termCondition === OrderTermCondition.Discount

  const renderFormInputs = () => (
    <>
      <FormItem name="conditionCode">
        <Select placeholder={t('Выберите условие договора...')} onChange={setTermCondition}>
          <Option value={OrderTermCondition.Comission}>{t('Комиссия от суммы финансирования')}</Option>
          <Option value={OrderTermCondition.Discount}>{t('Дисконт от суммы финансирования')}</Option>
        </Select>
      </FormItem>
      {isComission() &&
        <FormItem
          labelCol={{ span: 12 }}
          name="payer"
          label={t('Плательщик')}
          rules={[{
            required: true,
          }]}
        >
          <Select placeholder={t('Выберите плательщика...')} defaultValue={1}>
            <Option value={1}>{t('Поставщик')}</Option>
          </Select>
        </FormItem>
      }
      {isComission() &&
        <FormItem
          labelCol={{ span: 12 }}
          name="percentOverall"
          label={t('Cтавка (единовременная)')}
          rules={[{
            required: true,
          }]}
        >
          <Input type="number" suffix="%" />
        </FormItem>
      }

      {isComission() &&
        <FormItem
          labelCol={{ span: 12 }}
          name="percentYear"
          label={t('Cтавка (% годовых)')}
          rules={[{
            required: true,
          }]}
        >
          <Input type="number" suffix="%" />
        </FormItem>
      }
      {isDiscount() &&
        <FormItem
          labelCol={{ span: 12 }}
          name="percentDiscount"
          label={t('Размер дисконта')}
          rules={[{
            required: true,
          }]}
        >
          <Input type="number" suffix="%" />
        </FormItem>
      }
      {isComission() || isDiscount() &&
        <FormItem
          labelCol={{ span: 12 }}
          name="startDate"
          label={t('Дата начала действия')}
          rules={[{
            required: true,
          }]}
        >
          <DatePicker />
        </FormItem>
      }
    </>
  )

  const renderStepContent = () => (
    <Div className="OrderStepContractParams">
      <Title level={5}>{t('orderStepContractParams.title')}</Title>
      <Row>
        <Col lg={14} xl={12}>
          {renderFormInputs()}
        </Col>
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
    <Div className="WizardStep__content">
      <Form
        initialValues={formData}
        onFinish={(data: any) => handleFormSubmit(data)}
        labelWrap={true}
      >
        {renderStepContent()}
        {renderActions()}
      </Form>
    </Div>
  )
}

export default OrderStepContractParams
