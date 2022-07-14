import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { isUndefined } from 'lodash'
import moment from 'moment' // TODO: replace with dayjs

import { Form, Typography, Row, Col, Button, Input, DatePicker, Select, Skeleton, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { OrderConditions, OrderConditionType } from 'orient-ui-library/library/models/orderCondition'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { DATE_FORMAT } from 'orient-ui-library/library/helpers/date'

import {
  getFrameWizardStep,
  sendFrameWizardStep,
} from 'library/api/frameWizard'

import './OrderStepContractParams.style.less'

const { Title } = Typography
const { useForm, Item: FormItem } = Form
const { Option } = Select

export interface OrderStepContractParamsProps {
  bankId?: number | bigint
  orderId?: number
  offerStatus?: BankOfferStatus
  setOfferStatus: (step: BankOfferStatus) => void
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepContractParams: React.FC<OrderStepContractParamsProps> = ({
  bankId,
  orderId,
  offerStatus,
  currentStep,
  setCurrentStep,
  setOfferStatus,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()
  const [ form ] = useForm()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate typings
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ conditionCode, setConditionCode ] = useState<OrderConditionType>()
  const [ initialData, setInitialData ] = useState<OrderConditions | null>()
  const [ formDisabled, setFormDisabled ] = useState<boolean>(false)
  const [ isAccepted, setAccepted ] = useState<boolean>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (isUndefined(stepData)) {
      return
    }
    if (stepData?.conditions) {
      setInitialData({
        ...stepData.conditions,
        startDate: stepData.conditions.startDate ? moment(stepData.conditions.startDate) : undefined,
      })
      setConditionCode(stepData.conditions.conditionCode)
    } else {
      setInitialData(null)
    }
  }, [ stepData ])

  useEffect(() => {
    if (offerStatus) {
      setAccepted(offerStatus === BankOfferStatus.Completed)
    }
  }, [ offerStatus ])

  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      setNextStepAllowed(true)
      setFormDisabled(true)
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
    setNextStepAllowed(true)
  }

  const sendNextStep = async (terms: OrderConditions) => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep({
      step: sequenceStepNumber,
      bankId,
      orderId,
    }, {
      ...terms,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setOfferStatus(BankOfferStatus.BankSign)
      setCurrentStep(sequenceStepNumber + 1)
    }
    setSubmitting(false)
  }

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(sequenceStepNumber - 1)
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

  const renderNextButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={() => setCurrentStep(sequenceStepNumber + 1)}
      disabled={!isNextStepAllowed}
    >
      {t('common.actions.next.title')}
    </Button>
  )

  const renderSubmitButton = () => (
    <Button
      size="large"
      type="primary"
      htmlType="submit"
      disabled={!isNextStepAllowed || submitting}
      loading={submitting}
    >
      {t('orderStepContractParams.actionButton.title')}
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

  const handleFormSubmit = async (data: OrderConditions) => {
    if (isNextStepAllowed) {
      sendNextStep(data)
    }
  }

  const isComission = () => conditionCode === OrderConditionType.Comission
  const isDiscount = () => conditionCode === OrderConditionType.Discount
  const hidePayer = true // NOTE: be doesn't support this

  const formItemProps = {
    labelCol: { span: 14 },
    wrapperCol: { span: 10 },
  }

  const requiredRule = {
    required: true,
  }

  const renderFormInputs = () => (<>
    <FormItem
      name="conditionCode"
      rules={[ requiredRule ]}
    >
      <Select disabled={formDisabled} placeholder={t('models.orderCondition.fields.conditionCode.placeholder')}
              onChange={setConditionCode}>
        <Option
          value={OrderConditionType.Comission}>{t('models.orderCondition.fields.conditionCode.options.comission')}</Option>
        <Option
          value={OrderConditionType.Discount}>{t('models.orderCondition.fields.conditionCode.options.discount')}</Option>
      </Select>
    </FormItem>
    {isComission() && !hidePayer &&
      <FormItem
        {...formItemProps}
        name="payer"
        label={t('models.orderCondition.fields.payer.title')}
        rules={[ requiredRule ]}
      >
        <Select disabled={formDisabled} placeholder={t('models.orderCondition.fields.payer.placeholder')}
                defaultValue={1}>
          <Option value={1}>{t('models.orderCondition.fields.payer.options.provider')}</Option>
        </Select>
      </FormItem>
    }
    {isComission() &&
      <FormItem
        {...formItemProps}
        name="percentOverall"
        label={t('models.orderCondition.fields.percentOverall.title')}
        rules={[ requiredRule ]}
      >
        <Input disabled={formDisabled} type="number" suffix="%"/>
      </FormItem>
    }

    {isComission() &&
      <FormItem
        {...formItemProps}
        name="percentYear"
        label={t('models.orderCondition.fields.percentYear.title')}
        rules={[ requiredRule ]}
      >
        <Input disabled={formDisabled} type="number" suffix="%"/>
      </FormItem>
    }
    {isDiscount() &&
      <FormItem
        {...formItemProps}
        name="percentDiscount"
        label={t('models.orderCondition.fields.percentDiscount.title')}
        rules={[ requiredRule ]}
      >
        <Input disabled={formDisabled} type="number" suffix="%"/>
      </FormItem>
    }
    {(isComission() || isDiscount()) &&
      <FormItem
        {...formItemProps}
        name="startDate"
        label={t('models.orderCondition.fields.startDate.title')}
        rules={[ requiredRule ]}
      >
        <DatePicker format={DATE_FORMAT} disabled={formDisabled}/>
      </FormItem>
    }
  </>)

  const renderStepContent = () => (
    <Div className="OrderStepContractParams">
      <Title level={5}>{t('orderStepContractParams.title')}</Title>
      <Row>
        <Col lg={12} xl={10}>
          {renderFormInputs()}
        </Col>
      </Row>
    </Div>
  )

  if (isUndefined(initialData)) {
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
      <Form
        form={form}
        initialValues={initialData || undefined}
        onFinish={(data: any) => handleFormSubmit(data)}
        labelAlign="left"
        labelWrap={true}
      >
        {renderStepContent()}
        {!isAccepted && renderActions()}
      </Form>
    </Div>
  )
}

export default OrderStepContractParams
