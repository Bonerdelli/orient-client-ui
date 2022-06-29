import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { Button, Card, Col, Descriptions, message, Row, Select, Skeleton, Space, Typography } from 'antd'
import { BaseOptionType } from 'antd/es/select'

import Div from 'orient-ui-library/components/Div'
import EmptyResult from 'orient-ui-library/components/EmptyResult' // TODO: from ui-lib
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { Customer } from 'library/models' // TODO: check API schema, why not from proxy?
import { getFrameWizardStep, searchCustomers, startFrameWizard } from 'library/api'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'

import './OrderStepSelectInn.style.less'

const { Title, Text } = Typography
const { Item: DescItem } = Descriptions

export interface OrderSelectInnProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId?: number
  setOrderId: (orderId: number) => void
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  selectedCustomer: Customer | undefined
  setSelectedCustomer: (customer: Customer | undefined) => void
}

const OrderStepSelectInn: React.FC<OrderSelectInnProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  setOrderId,
  currentStep,
  sequenceStepNumber,
  setCurrentStep,
  selectedCustomer,
  setSelectedCustomer,
}) => {
  const { t } = useTranslation()
  const history = useHistory()

  const [ search, setSearch ] = useState<string>()
  const [ searching, setSearching ] = useState<boolean>(false)
  const [ foundItems, setFoundItems ] = useState<Customer[]>([])
  const [ selectedId, setSelectedId ] = useState<Customer['id']>()
  const [ options, setOptions ] = useState<BaseOptionType[]>()

  const [ stepData, setStepData ] = useState<unknown>()
  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  useEffect(() => {
    if (currentStep >= sequenceStepNumber) {
      setNextStepAllowed(true)
    }
  }, [ currentStep ])

  useEffect(() => {
    if (foundItems) {
      setFoundItems([])
    }
    if (selectedCustomer) {
      setSelectedCustomer(undefined)
    }
    handleSearch()
  }, [ search ])

  useEffect(() => {
    if (companyId && orderId) {
      setStepDataLoading(true)
      loadCurrentStepData()
    }
  }, [ companyId, orderId ])

  useEffect(() => {
    // TODO: ask be generate models for this and remove any
    if ((stepData as any)?.customerCompany?.id) {
      setSelectedId((stepData as any)?.customerCompany.id)
      setSearch('')
    }
  }, [ stepData ])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      type: wizardType,
      companyId: companyId as number,
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as any).data) // TODO: fix typings after BE updates swagger
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  useEffect(() => {
    const updatedResult = foundItems.map(datum => ({
      value: datum.id,
      label: (<Space>
        <Text>{datum.inn}</Text>
        <Text type="secondary">{datum.shortName}</Text>
      </Space>),
    }))
    setOptions(updatedResult)
  }, [ foundItems ])

  useEffect(() => {
    const item = foundItems.find(datum => datum.id === selectedId)
    setSelectedCustomer(item)
  }, [ foundItems, selectedId ])

  useEffect(() => {
    if (selectedCustomer) {
      setNextStepAllowed(true)
    }
    if (!selectedId) {
      setSelectedId(selectedCustomer?.id)
    }
  }, [ selectedCustomer ])

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
      const orderId = (result as any)?.data?.orderId as number
      if (wizardType === FrameWizardType.Full) {
        history.push(`/requests/frame/${orderId}`)
      } else {
        history.push(`/requests/frame-simple/${orderId}`)
      }
      setOrderId(orderId)
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
    if (selectedId && !selectedCustomer || stepDataLoading === true) {
      return (
        <Skeleton active={true}/>
      )
    }
    if (!selectedCustomer) {
      return <></>
    }
    const customer = selectedCustomer
    return (
      <Div className="OrderStepSelectInn__customerInfo">
        <Title level={5}>{t('frameSteps.selectInn.customerInfo.title')}</Title>
        <Card>
          <Descriptions column={2} title={customer.shortName}>
            <DescItem label={t('models.customer.fields.inn.title')}>{customer.inn}</DescItem>
            <DescItem label={t('models.customer.fields.shortName.title')}>{customer.shortName}</DescItem>
            <DescItem label={t('models.customer.fields.chief.title')}>{customer.chief}</DescItem>
            <DescItem label={t('models.customer.fields.soato.title')}>{customer.soato}</DescItem>
            <DescItem label={t('models.customer.fields.address.title')}>{customer.address}</DescItem>
            <DescItem label={t('models.customer.fields.inn.title')}>{customer.inn}</DescItem>
          </Descriptions>
        </Card>
      </Div>
    )
  }

  const handleNextStep = () => {
    if (orderId && isNextStepAllowed) {
      setCurrentStep(sequenceStepNumber + 1)
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
      <Title level={5}>{t('frameSteps.selectInn.title')}</Title>
      <Select
        className="OrderStepSelectInn__select"
        onSearch={setSearch}
        loading={searching}
        notFoundContent={search && <EmptyResult/>}
        onSelect={setSelectedId}
        options={options}
      >
      </Select>
    </Col>
  )

  const renderStepContent = () => (
    <Div className="OrderStepSelectInn">
      <Row>
        {!orderId && renderInnSelector()}
        {renderCustomerInfo()}
      </Row>
    </Div>
  )

  if (orderId && dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning"/>
    )
  }

  return (
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {currentStep <= sequenceStepNumber && renderActions()}
    </Div>
  )
}

// TODO: add live search (ask BE for partial search by inn)
// <Select
//   showSearch
//   placeholder={t('frameSteps.selectInn.placeholder')}

export default OrderStepSelectInn
