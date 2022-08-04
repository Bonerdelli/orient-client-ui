import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sortBy } from 'lodash'

import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
  Spin,
  Typography,
} from 'antd'

import { SelectOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import CompanyFounderInfo from 'orient-ui-library/components/CompanyFounderInfo'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { OrderStatus } from 'orient-ui-library/library/models/order'
import { FrameWizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderConditions, OrderConditionType } from 'orient-ui-library/library/models/orderCondition'
import { BankDto, CompanyFounderDto } from 'orient-ui-library/library/models/proxy'
import { DATE_FORMAT } from 'orient-ui-library/library/helpers/date'

import RejectOrderModal from 'components/RejectOrderModal'
import OrderDocumentsList from 'components/OrderDocumentsList'

import { FRAME_REJECTION_ALLOWED_STATUSES } from 'library/models/frameWizard'
import { Customer, DocumentStatus, GridResponse } from 'library/models' // TODO: to ui-lib // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getAllBanks } from 'library/api/bank'
import { getAllCustomers } from 'library/api/customer'

import {
  frameWizardSetDocStatus,
  getFrameWizardStep,
  sendFrameWizardStep2,
  frameWizardReject,
} from 'library/api/frameWizard'

import './OrderStepDocumentsAndConditions.style.less'

const { Title, Text } = Typography
const { useForm, Item: FormItem } = Form
const { Item: DescItem } = Descriptions
const { Option } = Select

export interface OrderDocumentsProps {
  wizardType?: FrameWizardType
  orderId?: number
  currentStep: number
  orderStatus?: OrderStatus
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: OrderStatus) => void
  isCurrentUserAssigned: boolean
  assignCurrentUser: () => Promise<unknown>
}

const formItemProps = {
  labelCol: { span: 10 },
}

const requiredRule = {
  required: true,
}

const OrderStepDocumentsAndConditions: React.FC<OrderDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  orderId,
  currentStep,
  orderStatus,
  sequenceStepNumber,
  setCurrentStep,
  setOrderStatus,
  isCurrentUserAssigned,
  assignCurrentUser,
}) => {
  const { t } = useTranslation()
  const [ form ] = useForm()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(true)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate models
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ documentsLoading, setDocumentsLoading ] = useState<boolean>(true)
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ documentTypesOptional, setDocumentTypesOptional ] = useState<number[]>()
  const [ documents, setDocuments ] = useState<OrderDocument[]>([])
  const [ documentsOptional, setDocumentsOptional ] = useState<OrderDocument[] | null>()

  const [ banks, banksLoaded ] = useApi<GridResponse<BankDto> | null>(getAllBanks)
  const [ customers, customersLoaded ] = useApi<GridResponse<Customer> | null>(getAllCustomers)
  const [ customer, setCustomer ] = useState<Customer>()

  const [ bankSelectItems, setBankSelectItems ] = useState<BankDto[]>([])
  const [ customerSelectItems, setCustomerSelectItems ] = useState<Customer[]>([])
  const [ conditionCode, setConditionCode ] = useState<OrderConditionType>()
  const [ initialData, setInitialData ] = useState<OrderConditions | null>() // NOTE: be doesn't return current offer
  const [ formDisabled, setFormDisabled ] = useState<boolean>(false)

  const [ clientCompanyFounder, setClientCompanyFounder ] = useState<CompanyFounderDto | null>(null)
  const [ companyFounderModalVisible, setCompanyFounderModalVisible ] = useState<boolean>(false)

  const [ rejectModalOpened, setRejectModalOpened ] = useState<boolean>(false)

  useEffect(() => {
    loadStepData()
    setFormDisabled(currentStep > sequenceStepNumber || !isCurrentUserAssigned)
  }, [ currentStep ])

  useEffect(() => {
    setNextStepAllowed(orderStatus === OrderStatus.FRAME_OPERATOR_VERIFYING)
  }, [ orderStatus ])

  useEffect(() => {
    setFormDisabled(currentStep > sequenceStepNumber || !isCurrentUserAssigned)
  }, [ isCurrentUserAssigned ])

  useEffect(() => {
    setBankSelectItems(banks?.data ?? [])
  }, [ banks ])

  useEffect(() => {
    setCustomerSelectItems(customers?.data ?? [])
  }, [ customers ])

  /**
   * Load and parse step data
   */

  useEffect(() => {
    if (!stepData) return

    const currentDocuments = stepData?.documents ?? []
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentsOptional: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []
    const updatedDocumentTypesOptional: number[] = []

    sortBy(currentDocuments, 'priority')
      .filter((doc: OrderDocument) => !(doc.isGenerated && !doc.info))
      .forEach((doc: OrderDocument) => {
        if (doc.isRequired) {
          updatedDocumentTypes.push(doc.typeId)
          updatedDocuments.push(doc)
        } else {
          updatedDocumentTypesOptional.push(doc.typeId)
          updatedDocumentsOptional.push(doc)
        }
      })

    setClientCompanyFounder(stepData?.clientCompanyFounder)
    setDocuments(updatedDocuments)
    setDocumentTypes(updatedDocumentTypes)
    setDocumentTypesOptional(updatedDocumentTypesOptional)
    setDocumentsOptional(updatedDocumentsOptional.length ? updatedDocumentsOptional : null)
    setDocumentsLoading(false)
  }, [ stepData ])

  const loadStepData = async () => {
    if (documentTypes === null) {
      // NOTE: do not show loader every time updates
      setDocumentsLoading(true)
    }
    const result = await getFrameWizardStep({
      type: wizardType,
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<any>).data) // TODO: ask be to generate models
      setOrderStatus((result.data as FrameWizardStepResponse<unknown>).orderStatus as OrderStatus) // TODO: ask be to generate typings
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  /**
   * Step actions
   */

  const sendNextStep = async () => {
    if (!orderId) {
      return
    }
    const formData = form.getFieldsValue()
    setSubmitting(true)
    const result = await sendFrameWizardStep2({
      type: wizardType,
      orderId,
    }, {
      ...formData,
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

  const handleSubmit = () => {
    if (isNextStepAllowed) {
      sendNextStep()
    }
  }

  const handleReject = async (code: number, reason: string) => {
    const result = await frameWizardReject({
      type: wizardType,
      step: sequenceStepNumber,
      orderId,
    }, {
      rejectReasonId: code,
      rejectComment: reason,
    })
    loadStepData()
    return result.success ?? false
  }

  const renderBackButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handlePrevStep}
        disabled={!isPrevStepAllowed}
      >
        {t('common.actions.back.title')}
      </Button>
    )
  }

  const renderRejectButton = () => {
    return (
      <Button
        danger
        size="large"
        type="default"
        onClick={() => setRejectModalOpened(true)}
      >
        {t('common.actions.reject.title')}
      </Button>
    )
  }

  const renderNextButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handleNextStep}
        disabled={!isNextStepAllowed}
      >
        {t('orderActions.next.title')}
      </Button>
    )
  }

  const renderSubmitButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        htmlType="submit"
        disabled={submitting || !isNextStepAllowed}
        loading={submitting}
      >
        {t('orderActions.next.title')}
      </Button>
    )
  }

  const handleOrderAssign = async () => {
    setSubmitting(true)
    await assignCurrentUser()
    setSubmitting(false)
  }
  const renderAssignOrderButton = () => (
    <Button
      size="large"
      type="primary"
      disabled={submitting}
      onClick={handleOrderAssign}
    >
      {t('orderActions.assign.title')}
    </Button>
  )

  const renderAssignAction = () => (
    <Row className="WizardStep__actions WizardStep__actions--single">
      <Col>{renderAssignOrderButton()}</Col>
    </Row>
  )

  const rejectAllowed = orderStatus && !FRAME_REJECTION_ALLOWED_STATUSES.includes(orderStatus)

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col>{renderBackButton()}</Col>
      <Col>{rejectAllowed && renderRejectButton()}</Col>
      <Col flex={1}></Col>
      <Col>{formDisabled ? renderNextButton() : renderSubmitButton()}</Col>
    </Row>
  )

  /**
   * Order documents
   */

  const changeDocStatus = async (documentId: number, status: DocumentStatus) => {
    const result = await frameWizardSetDocStatus({
      type: wizardType,
      orderId,
    }, {
      documentId,
      documentStatus: status,
    })
    return Boolean(result?.success)
  }

  const renderDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        types={documentTypes || []}
        current={documents}
        onChange={loadStepData}
        setStatusHandler={changeDocStatus}
        readonlyMode={!isCurrentUserAssigned}
      />
    </Spin>
  )

  const renderOptionalDocumentsSection = () => (
    <Div className="WizardStep__section">
      <Title level={5}>{t('orderStepDocuments.sectionTitles.additionalDocs')}</Title>
      {renderOptionalDocuments()}
    </Div>
  )

  const renderOptionalDocuments = () => (
    <Spin spinning={documentsLoading}>
      <OrderDocumentsList
        orderId={orderId as number}
        types={documentTypesOptional as number[]}
        current={documentsOptional as OrderDocument[]}
        onChange={loadStepData}
        setStatusHandler={changeDocStatus}
        readonlyMode={!isCurrentUserAssigned}
      />
    </Spin>
  )

  const renderOrderParametersSection = () => (
    <Div className="WizardStep__section">
      <Title level={5}>{t('orderStepDocuments.sectionTitles.orderParameters')}</Title>
      <Row gutter={12}>
        <Col xs={24} lg={12}>
          {renderOrderParametersFormInputs()}
          {renderOrderConditionsFormInputs()}
        </Col>
        <Col xs={24} lg={12}>
          {customer && renderCustomerInfo()}
        </Col>
      </Row>
    </Div>
  )

  /**
   * Order condition form for a simple frame order
   */

  const isComission = () => conditionCode === OrderConditionType.Comission
  const isDiscount = () => conditionCode === OrderConditionType.Discount

  const updateSelectedCustomer = (id: number) => {
    const selectedCustomer = customerSelectItems.find(item => item.id === id)
    setCustomer(selectedCustomer)
  }

  const renderOrderParametersFormInputs = () => (<>
    <FormItem {...formItemProps}
              name="customerId"
              label={t('orderStepDocuments.orderParametersFormFields.customer.title')}
              rules={[ requiredRule ]}>
      <Select disabled={formDisabled}
              placeholder={t('orderStepDocuments.orderParametersFormFields.customer.placeholder')}
              onChange={updateSelectedCustomer}
              loading={banksLoaded === null}>
        {customerSelectItems.map(item => (
          <Option key={item.id} value={item.id}>
            <Text>{item.inn}</Text>{' '}
            <Text type="secondary" ellipsis={true}>{item.shortName}</Text>
          </Option>
        ))}
      </Select>
    </FormItem>
    <FormItem {...formItemProps}
              name="bankId"
              label={t('orderStepDocuments.orderParametersFormFields.bank.title')}
              rules={[ requiredRule ]}>
      <Select disabled={formDisabled}
              placeholder={t('orderStepDocuments.orderParametersFormFields.bank.placeholder')}
              loading={customersLoaded === null}>
        {bankSelectItems.map(item => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    </FormItem>
  </>)

  // TODO: make a shared component with bank/src/components/OrderStepContractParams maybe?

  const renderOrderConditionsFormInputs = () => (<>
    <FormItem {...formItemProps}
              name="conditionCode"
              label={t('models.orderCondition.fields.conditionCode.title')}
              rules={[ requiredRule ]}>
      <Select disabled={formDisabled}
              placeholder={t('models.orderCondition.fields.conditionCode.placeholder')}
              onChange={setConditionCode}>
        <Option value={OrderConditionType.Comission}>
          {t('models.orderCondition.fields.conditionCode.options.comission')}
        </Option>
        <Option value={OrderConditionType.Discount}>
          {t('models.orderCondition.fields.conditionCode.options.discount')}
        </Option>
      </Select>
    </FormItem>
    {isComission() &&
      <FormItem {...formItemProps}
                name="percentOverall"
                label={t('models.orderCondition.fields.percentOverall.title')}
                rules={[ requiredRule ]}>
        <Input disabled={formDisabled} type="number" suffix="%"/>
      </FormItem>
    }
    {isComission() &&
      <FormItem {...formItemProps}
                name="percentYear"
                label={t('models.orderCondition.fields.percentYear.title')}
                rules={[ requiredRule ]}>
        <Input disabled={formDisabled} type="number" suffix="%"/>
      </FormItem>
    }
    {isDiscount() &&
      <FormItem {...formItemProps}
                name="percentDiscount"
                label={t('models.orderCondition.fields.percentDiscount.title')}
                rules={[ requiredRule ]}>
        <Input disabled={formDisabled} type="number" suffix="%"/>
      </FormItem>
    }
    {(isComission() || isDiscount()) &&
      <FormItem {...formItemProps}
                name="startDate"
                label={t('models.orderCondition.fields.startDate.title')}
                rules={[ requiredRule ]}>
        <DatePicker format={DATE_FORMAT} disabled={formDisabled}/>
      </FormItem>
    }
  </>)

  // TODO: make a component in ui-lib
  const renderCustomerInfo = () => (
    <Card className="OrderStepDocumentsAndConditions__customerInfo">
      <Descriptions column={1}>
        <DescItem label={t('models.customer.fields.inn.title')}>{customer?.inn}</DescItem>
        <DescItem label={t('models.customer.fields.shortName.title')}>{customer?.shortName}</DescItem>
        <DescItem label={t('models.customer.fields.chief.title')}>{customer?.chief}</DescItem>
        <DescItem label={t('models.customer.fields.soato.title')}>{customer?.soato}</DescItem>
        <DescItem label={t('models.customer.fields.address.title')}>{customer?.address}</DescItem>
      </Descriptions>
    </Card>
  )

  /**
   * Company Founder modal
   */

  const openCompanyFounderModal = () => {
    setCompanyFounderModalVisible(true)
  }

  const closeCompanyFounderModal = () => {
    setCompanyFounderModalVisible(false)
  }

  const renderCompanyFounderSection = () => (
    <Div className="WizardStep__section">
      <Title level={5}>
        {t('orderStepDocuments.companyFounderInformation.title')}
        <Button size="small"
                type="link"
                icon={<SelectOutlined/>}
                onClick={openCompanyFounderModal}
        >
          {t('orderStepDocuments.companyFounderInformation.check')}
        </Button>
      </Title>
      <Modal
        visible={companyFounderModalVisible}
        centered
        width={700}
        bodyStyle={{ paddingTop: '0' }}
        title={t('orderStepDocuments.companyFounderInformation.title')}
        onCancel={closeCompanyFounderModal}
        footer={
          <Button type="primary"
                  onClick={closeCompanyFounderModal}>
            {t('models.bankRequisites.close')}
          </Button>
        }
      >
        <CompanyFounderInfo companyFounder={clientCompanyFounder}/>
      </Modal>
    </Div>
  )

  const renderStepContent = () => (
    <Div className="OrderStepDocumentsAndConditions">
      <Div className="OrderStepDocumentsAndConditions__title">
        <Title level={4}>{t('orderStepDocuments.title')}</Title>
      </Div>
      <Div className="WizardStep__section">
        <Title level={5}>{t('orderStepDocuments.sectionTitles.mainDocs')}</Title>
        {renderDocuments()}
      </Div>
      {documentsOptional !== null && renderOptionalDocumentsSection()}
      {renderCompanyFounderSection()}
      {renderOrderParametersSection()}
    </Div>
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
      <Form
        form={form}
        initialValues={initialData || undefined}
        onFinish={handleSubmit}
        labelAlign="left"
        labelWrap={true}
      >
        {renderStepContent()}
        {isCurrentUserAssigned ? renderActions() : renderAssignAction()}
        <RejectOrderModal
          opened={rejectModalOpened}
          setOpened={setRejectModalOpened}
          rejectHandler={handleReject}
        />
      </Form>
    </Div>
  )
}

export default OrderStepDocumentsAndConditions
