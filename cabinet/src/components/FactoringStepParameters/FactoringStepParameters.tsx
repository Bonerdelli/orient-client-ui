import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Form, Input, message, Row, Select, Skeleton, Space, Spin, Typography } from 'antd'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { WizardStepResponse } from 'orient-ui-library/library/models/wizard'

import {
  FactoringWizardStep1To2RequestDto,
  getFactoringWizardStep,
  initFactoringWizard,
  sendFactoringWizardStep,
} from 'library/api/factoringWizard'

import './FactoringStepParameters.style.less'
import { BaseOptionType } from 'antd/es/select'
import { getOrdersForFactoring } from 'library/api/orders'
import { OrderForFactoringDto } from 'library/models/orders'
import { getOffersForFactoring } from 'library/api/offers'
import { OfferForFactoringDto } from 'library/models/offers'
import { Dictionaries } from 'library/models/dictionaries'
import { CabinetMode } from 'library/models/cabinet'
import { EditOutlined } from '@ant-design/icons'
import { convertDictionaryToSelectOptions } from 'library/converters/dictionary-to-select-options.converter'
import OrderCondition from 'orient-ui-library/components/OrderCondition'
import { useHistory } from 'react-router-dom'

const { Text, Title, Paragraph } = Typography

export interface FactoringStepParametersProps {
  companyId: number
  setCompanyId: (id: number) => void
  factoringOrderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  dictionaries?: Dictionaries
}

type FactoringParamsForm = Omit<FactoringWizardStep1To2RequestDto, 'orderId' | 'bankId'>

const FactoringStepParameters: React.FC<FactoringStepParametersProps> = ({
  companyId,
  setCompanyId,
  factoringOrderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
  dictionaries,
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [ factoringParamsForm ] = Form.useForm<FactoringParamsForm>()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ stepData, setStepData ] = useState<unknown>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ orderList, setOrderList ] = useState<OrderForFactoringDto[]>([])
  const [ orderOptions, setOrderOptions ] = useState<BaseOptionType[]>()
  const [ selectedOrderId, setSelectedOrderId ] = useState<number | null>(null)

  const [ offerList, setOfferList ] = useState<OfferForFactoringDto[]>([])
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
    if (currentStep > sequenceStepNumber) {
      // NOTE: only for debugging
      setNextStepAllowed(true)
    }
  }, [ currentStep, sequenceStepNumber ])

  useEffect(() => {
    if (selectedOrderId !== null) {
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
    const result = await getFactoringWizardStep({
      step: sequenceStepNumber,
      companyId,
      orderId: factoringOrderId,
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
  const loadOrdersForFactoring = async () => {
    setStepDataLoading(true)

    const result = await getOrdersForFactoring(companyId)
    if (result.success) {
      const orders = result.data?.data ?? []
      const options = orders.map(renderOrderOption)
      setOrderList(orders)
      setOrderOptions(options)
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
      const options = offers.map((order: OfferForFactoringDto) => ({
        value: order.bankId,
        label: order.bankName,
      }))
      setOfferList(offers)
      setOfferOptions(options)
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
        setCompanyId(id) // TODO: надо ли?
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

  const renderOrderOption = (order: OrderForFactoringDto) => ({
    value: order.id,
    label: (<Space>
      <Text>{order.id}</Text>
      <Text type="secondary">
        {t('factoringStepParameters.frameOrderNumber.customer')} {order.customer.inn}
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
        defaultValue={selectedOrderId}
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
        defaultValue={selectedOfferBankId}
        onSelect={setSelectedOfferBankId}
        disabled={!!factoringOrderId}
      />
    </Form.Item>
  )

  const renderCustomerInfo = () => {
    const customer = orderList.find(({ id }) => id === selectedOrderId)?.customer

    if (!customer) return (<></>)

    return (
      <Space direction="vertical">
        <Title level={5}>
          {t('factoringStepParameters.customerInfoFromOrder.title')}
        </Title>
        <Text>{customer.shortName}</Text>
        <Text>{t('factoringStepParameters.customerInfoFromOrder.head')} {customer.chief}</Text>
        <Text>{customer.soato}</Text>
        <Text>{t('factoringStepParameters.customerInfoFromOrder.address')} {customer.address}</Text>
      </Space>
    )
  }

  const renderFactoringOrderParams = () => {
    const factoringParamsFormLayout = {
      colon: false,
      wrapperCol: { span: 'auto' },
      labelCol: { span: 10 },
      labelAlign: 'left' as any,
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
        <Div className="FactoringStepParameters__row">
          {selectedOfferBankId && <OrderCondition condition={conditions} size="small"/>}
        </Div>
        {selectedOfferBankId && renderFactoringOrderParams()}
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
      {renderActions()}
    </Spin>
  )
}

export default FactoringStepParameters
