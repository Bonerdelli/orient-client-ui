import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Form, Input, Descriptions, Row, Select, Skeleton, Space, Spin, Typography, message } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import {
  FactoringWizardStep1Dto,
  FactoringWizardStep1ResponseDto,
  FactoringWizardStep1To2RequestDto,
  getFactoringWizardStep,
  initFactoringWizard,
  sendFactoringWizardStep,
} from 'library/api/factoringWizard'

import './FactoringStepParameters.style.less'
import { BaseOptionType } from 'antd/es/select'
import { getOrdersForFactoring } from 'library/api/orders'
import { FrameOrderForFactoringDto } from 'library/models/orders'
import { getOffersForFactoring } from 'library/api/offers'
import { FrameOrderOfferForFactoringDto } from 'library/models/offers'
import { Dictionaries } from 'orient-ui-library/library/models/dictionaries'
import { CabinetMode } from 'library/models/cabinet'
import { EditOutlined } from '@ant-design/icons'
import { convertDictionaryToSelectOptions } from 'library/converters/dictionary-to-select-options.converter'
import OrderCondition from 'orient-ui-library/components/OrderCondition'
import { useHistory, useLocation } from 'react-router-dom'
import { FACTORING_ORDER_ID_PARAM, OFFER_BANK_ID_PARAM } from 'library/constants'

const { Text, Paragraph } = Typography
const { Item: DescItem } = Descriptions

export interface FactoringStepParametersProps {
  companyId: number
  factoringOrderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  dictionaries?: Dictionaries
}

type FactoringParamsForm = Omit<FactoringWizardStep1To2RequestDto, 'orderId' | 'bankId'>

const FactoringStepParameters: React.FC<FactoringStepParametersProps> = ({
  companyId,
  factoringOrderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
  dictionaries,
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { search } = useLocation()
  const queryParams = new URLSearchParams(search)
  const factoringOrderIdFromQueryParams = queryParams.get(FACTORING_ORDER_ID_PARAM)
  const bankOfferIdFromQueryParams = queryParams.get(OFFER_BANK_ID_PARAM)
  const [ factoringParamsForm ] = Form.useForm<FactoringParamsForm>()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ stepData, setStepData ] = useState<FactoringWizardStep1Dto>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ orderList, setOrderList ] = useState<FrameOrderForFactoringDto[]>([])
  const [ orderOptions, setOrderOptions ] = useState<BaseOptionType[]>()
  const [ selectedOrderId, setSelectedOrderId ] = useState<number | null>(null)

  const [ offerList, setOfferList ] = useState<FrameOrderOfferForFactoringDto[]>([])
  const [ offerOptions, setOfferOptions ] = useState<BaseOptionType[]>()
  const [ selectedOfferBankId, setSelectedOfferBankId ] = useState<number | null>(null)

  useEffect(() => {
    if (factoringOrderId) {
      loadCurrentStepData()
    } else {
      loadOrdersForFactoring()
    }
  }, [ factoringOrderId ])

  useEffect(() => {
    if (stepData) {
      const { bank, frameOrder } = stepData
      setOrderList([ frameOrder ])
      setOrderOptions([ frameOrder ].map(renderOrderOption))
      setSelectedOrderId(frameOrder.id)
      setOfferList([ bank ])
      setOfferOptions([ bank ].map((order: FrameOrderOfferForFactoringDto) => ({
        value: order.bankId,
        label: order.bankName,
      })))
      setSelectedOfferBankId(bank.bankId)
    }
  }, [ stepData ])

  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      // NOTE: only for debugging
      setNextStepAllowed(true)
    }
  }, [ currentStep, sequenceStepNumber ])

  useEffect(() => {
    if (selectedOrderId !== null && !factoringOrderId) {
      setSelectedOfferBankId(null)
      setOfferOptions([])
      loadOffersForFactoring()
    }
  }, [ selectedOrderId ])

  useEffect(() => {
    if (selectedOfferBankId) {
      setNextStepAllowed(true)
    }
  }, [ selectedOfferBankId ])

  const loadCurrentStepData = async () => {
    setStepDataLoading(true)
    const result = await getFactoringWizardStep<FactoringWizardStep1ResponseDto>({
      step: sequenceStepNumber,
      companyId,
      orderId: factoringOrderId,
    })
    if (result.success) {
      setStepData(result.data!.data)
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }
  const loadOrdersForFactoring = async () => {
    setStepDataLoading(true)

    const result = await getOrdersForFactoring(companyId)
    if (result.success) {
      const orders = result.data?.data ?? []
      const options = orders.map(renderOrderOption)
      setOrderList(orders)
      setOrderOptions(options)
      if (factoringOrderIdFromQueryParams) {
        setSelectedOrderId(+factoringOrderIdFromQueryParams)
      }
    } else {
      setDataLoaded(false)
    }

    setStepDataLoading(false)
  }
  const loadOffersForFactoring = async () => {
    setStepDataLoading(true)

    const result = await getOffersForFactoring({ orderId: selectedOrderId!, companyId })
    if (result.success) {
      const offers = result.data?.data ?? []
      const options = offers.map((order: FrameOrderOfferForFactoringDto) => ({
        value: order.bankId,
        label: order.bankName,
      }))
      setOfferList(offers)
      setOfferOptions(options)
      if (bankOfferIdFromQueryParams) {
        setSelectedOfferBankId(+bankOfferIdFromQueryParams)
      }
    } else {
      message.error(t('factoringStepParameters.apiErrors.fetchOfferList'))
    }

    setStepDataLoading(false)
  }

  const createFactoringOrder = async (request: FactoringWizardStep1To2RequestDto) => {
    const result = await initFactoringWizard({
      step: sequenceStepNumber,
      companyId,
      mode: CabinetMode.Client,
    }, request)
    if (result.success) {
      const id = result.data?.orderId ?? null
      if (id !== null) {
        history.push(`/requests/factoring/${id}`)
      } else {
        message.error(t('factoringStepParameters.apiErrors.incorrectFactoringOrderId', { orderId: id }))
        setSubmitting(false)
      }
    }
  }
  const handleFactoringFormSubmit = (values: FactoringParamsForm) => {
    setSubmitting(true)
    createFactoringOrder({ ...values, orderId: selectedOrderId!, bankId: selectedOfferBankId! })
  }
  const sendNextStep = async () => {
    if (factoringOrderId === undefined) {
      factoringParamsForm.submit()
    } else {
      setSubmitting(true)
      const result = await sendFactoringWizardStep({
        step: sequenceStepNumber,
        companyId,
        orderId: factoringOrderId,
      }, {})
      if (!result.success) {
        message.error(t('common.errors.requestError.title'))
        setNextStepAllowed(false)
      } else {
        setCurrentStep(sequenceStepNumber + 1)
      }
      setSubmitting(false)
    }
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const renderOrderOption = (order: FrameOrderForFactoringDto) => ({
    value: order.id,
    label: (<Space>
      <Text>{order.id}</Text>
      <Text type="secondary">
        {t('factoringStepParameters.frameOrderNumber.customer')}{' '}{order.customer.inn}
        {' '}–{' '}
        {order.customer.shortName}
      </Text>
    </Space>),
  })

  const renderActions = () => {
    return (
      <Row className="WizardStep__actions"
           justify="end">
        <Col>
          <Button
            size="large"
            type="primary"
            onClick={handleNextStep}
            loading={submitting}
            disabled={!isNextStepAllowed}
          >
            {t('factoringStepParameters.nextStep')}
          </Button>
        </Col>
      </Row>
    )
  }

  const renderSelectOrder = () => (
    <Form.Item label={t('factoringStepParameters.frameOrderNumber.title')}>
      <Select
        placeholder={t('factoringStepParameters.frameOrderNumber.placeholder')}
        options={orderOptions}
        value={selectedOrderId}
        onSelect={setSelectedOrderId}
        disabled={!!factoringOrderId}
      />
    </Form.Item>
  )
  const renderSelectBank = () => (
    <Form.Item label={t('factoringStepParameters.selectBank.title')}>
      <Select
        placeholder={t('factoringStepParameters.selectBank.placeholder')}
        options={offerOptions}
        value={selectedOfferBankId}
        onSelect={setSelectedOfferBankId}
        disabled={!!factoringOrderId}
      />
    </Form.Item>
  )

  const renderCustomerInfo = () => {
    const customer = orderList.find(({ id }) => id === selectedOrderId)?.customer

    if (!customer) return (<></>)

    return (
      <Descriptions column={1} title={t('factoringStepParameters.customerInfoFromOrder.title')}>
        <DescItem>{customer.shortName}</DescItem>
        <DescItem label={t('models.customer.fields.chief.title')}>{customer.chief}</DescItem>
        <DescItem label={t('models.customer.fields.address.title')}>{customer.address}</DescItem>
        <DescItem label={t('models.customer.fields.soato.title')}>{customer.soato}</DescItem>
      </Descriptions>
    )
  }

  const renderFactoringOrderParams = () => {
    let initialValues
    if (!!factoringOrderId && stepData) {
      const { bank, frameOrder, ...formData } = stepData
      initialValues = formData
    }

    const factoringParamsFormLayout = {
      colon: false,
      wrapperCol: { span: 'auto' },
      labelCol: { span: 10 },
      labelAlign: 'left' as any,
      initialValues,
    }
    const inputLayout = {
      suffix: <EditOutlined/>,
      disabled: !!factoringOrderId,
    }

    const currencyOptions = dictionaries && convertDictionaryToSelectOptions(dictionaries.currency)

    return (
      <Form {...factoringParamsFormLayout}
            form={factoringParamsForm}
            onFinish={handleFactoringFormSubmit}
      >
        {!!factoringOrderId && <Paragraph>{t('factoringStepParameters.form.title')}</Paragraph>}
        <Row gutter={16} wrap>
          <Col sm={24} md={12}>
            <Form.Item name="amount"
                       required
                       label={t('factoringStepParameters.form.amount.title')}>
              <Input {...inputLayout}
                     type={'number'}
                     placeholder={t('factoringStepParameters.form.amount.placeholder')}/>
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item name="currencyCode"
                       required
                       label={t('factoringStepParameters.form.currencyCode.title')}>
              <Select placeholder={t('factoringStepParameters.form.currencyCode.placeholder')}
                      disabled={!!factoringOrderId}
                      options={currencyOptions}/>
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item name="days"
                       required
                       label={t('factoringStepParameters.form.days.title')}>
              <Input {...inputLayout}
                     type={'number'}
                     placeholder={t('factoringStepParameters.form.days.placeholder')}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col sm={24} md={12}>
            <Form.Item name="contractNumber"
                       label={t('factoringStepParameters.form.contractNumber.title')}>
              <Input {...inputLayout}
                     placeholder={t('factoringStepParameters.form.contractNumber.placeholder')}/>
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item name="purchaseNumber"
                       label={t('factoringStepParameters.form.purchaseNumber.title')}>
              <Input {...inputLayout}
                     placeholder={t('factoringStepParameters.form.purchaseNumber.placeholder')}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }

  const selectFormLayout = {
    layout: 'vertical' as any,
    colon: false,
    wrapperCol: { span: 24 },
  }
  const renderStepContent = () => {
    const conditions = offerList.find(({ bankId }) => bankId === selectedOfferBankId)?.conditions

    return (<>
      {!factoringOrderId && t('factoringStepParameters.desc')}
      <Div className="FactoringStepParameters">
        <Row className="FactoringStepParameters__row" gutter={24}>
          <Col span={12}>
            <Form {...selectFormLayout}>
              {renderSelectOrder()}
              {selectedOrderId !== null && renderSelectBank()}
            </Form>
          </Col>
          <Col span={12}>
            {selectedOrderId !== null && renderCustomerInfo()}
          </Col>
        </Row>
        <Row className="FactoringStepParameters__row" gutter={24}>
          <Col span={12}>
            {selectedOfferBankId && <OrderCondition condition={conditions} size="small"/>}
          </Col>
          <Col span={24} className="FactoringStepParameters__conditionsForm">
            {selectedOfferBankId && renderFactoringOrderParams()}
          </Col>
        </Row>
      </Div>
    </>)
  }

  if (factoringOrderId !== undefined && !stepData && stepDataLoading) {
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
    <Spin spinning={stepDataLoading}
          className="FactoringStepParameters__content"
    >
      {renderStepContent()}
      {!factoringOrderId && renderActions()}
    </Spin>
  )
}

export default FactoringStepParameters
