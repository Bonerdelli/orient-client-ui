import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Descriptions, Space, Row, Col, Card, Skeleton, Select, Button, message } from 'antd'
import { BaseOptionType } from 'antd/es/select'

import Div from 'components/Div' // TODO: from ui-lib
import EmptyResult from 'components/EmptyResult' // TODO: from ui-lib

import { Customer } from 'library/models' // TODO: check API schema, why not from proxy?
import { FrameWizardType, searchCustomers, startFrameWizard } from 'library/api'

import './FrameSelectInn.style.less'

const { Title, Text } = Typography
const { Item: DescItem } = Descriptions

export interface FrameSelectInnProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId?: number
  currentStep: number
  currentStepData?: unknown
  setCurrentStep: (step: number) => void
  selectedCustomer: Customer | undefined
  setSelectedCustomer: (customer: Customer | undefined) => void
}

const FrameSelectInn: React.FC<FrameSelectInnProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  currentStep,
  currentStepData,
  setCurrentStep,
  selectedCustomer,
  setSelectedCustomer,
}) => {
  const { t } = useTranslation()

  const [ search, setSearch ] = useState<string>()
  const [ searching, setSearching ] = useState<boolean>(false)
  const [ foundItems, setFoundItems ] = useState<Customer[]>([])
  const [ options, setOptions ] = useState<BaseOptionType[]>()

  const [ selectedId, setSelectedId ] = useState<Customer['id']>()
  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    if (currentStep >= 1) {
      setNextStepAllowed(true)
    }
  }, [currentStep])

  useEffect(() => {
    if (foundItems) {
      setFoundItems([])
    }
    if (selectedCustomer) {
      setSelectedCustomer(undefined)
    }
    handleSearch()
  }, [search])

  console.log('FrameSignDocuments', currentStep)

  useEffect(() => {
    if ((currentStepData as any)?.founder?.id) {
      setSelectedId((currentStepData as any)?.founder?.id)
      setSearch('') // TODO: switch to getting customer by ID after BE will ready
    }
  }, [currentStepData])

  useEffect(() => {
    const updatedResult = foundItems.map(datum => ({
      value: datum.id,
      label: (<Space>
        <Text>{datum.inn}</Text>
        <Text type="secondary">{datum.shortName}</Text>
      </Space>),
    }))
    setOptions(updatedResult)
  }, [foundItems])

  useEffect(() => {
    const item = foundItems.find(datum => datum.id === selectedId)
    setSelectedCustomer(item)
  }, [foundItems, selectedId])

  useEffect(() => {
    if (selectedCustomer) {
      setNextStepAllowed(true)
    }
    if (!selectedId) {
      setSelectedId(selectedCustomer?.id)
    }
  }, [selectedCustomer])

  const sendNextStep = async () => {
    if (!selectedCustomer) {
      return
    }
    setSubmitting(true)
    const result = await startFrameWizard({
      type: wizardType,
      companyId,
    }, {
      customerId: selectedCustomer?.id,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setCurrentStep(currentStep + 1)
    }
    setSubmitting(false)
  }

  const handleSearch = async () => {
    setSearching(true)
    const result = await searchCustomers({ inn: search })
    if (result.success) {
      const items = result.data?.data ?? []
      setFoundItems(items as unknown as Customer[])
    } else {
      message.error(t('common.errors.dataLoadingError.title'))
    }
    setSearching(false)
  }

  const renderCustomerInfo = () => {
    if (selectedId && !selectedCustomer) {
      return (
        <Skeleton active={true} />
      )
    }
    if (!selectedCustomer) {
      return <></>
    }
    const customer = selectedCustomer
    return (
      <Div className="FrameSelectInn__customerInfo">
        <Title level={5}>{t('frameSteps.selectInn.customerInfo.title')}</Title>
        <Card>
          <Descriptions title={customer.shortName}>
            <DescItem label={t('models.customer.fields.shortName.title')}>{customer.shortName}</DescItem>
            <DescItem label={t('models.customer.fields.chief.title')}>{customer.chief}</DescItem>
            <DescItem label={t('models.customer.fields.soato.title')}>{customer.soato}</DescItem>
            <DescItem label={t('models.customer.fields.address.title')}>{customer.address}</DescItem>
          </Descriptions>
        </Card>
      </Div>
    )
  }

  const handleNextStep = () => {
    if (orderId && isNextStepAllowed) {
      setCurrentStep(currentStep + 1)
    } else if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const renderCancelButton = () => {
    return (<></>)
  }

  const renderNextButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handleNextStep}
        disabled={!isNextStepAllowed || submitting}
        loading={submitting}
      >
        {t('orders.actions.next.title')}
      </Button>
    )
  }

  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col>{renderCancelButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const renderInnSelector = () => (
    <Col lg={12} xl={10}>
      <Select
        className="FrameSelectInn__select"
        onSearch={setSearch}
        loading={searching}
        notFoundContent={search && <EmptyResult />}
        onSelect={setSelectedId}
        options={options}
      >
      </Select>
    </Col>
  )

  const renderStepContent = () => (
    <Div className="FrameSelectInn">
      <Title level={5}>{t('frameSteps.selectInn.title')}</Title>
      <Row>
        {currentStep < 1 && renderInnSelector()}
        {renderCustomerInfo()}
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

// TODO: add live search (ask BE for partial search by inn)
// <Select
//   showSearch
//   placeholder={t('frameSteps.selectInn.placeholder')}

export default FrameSelectInn
