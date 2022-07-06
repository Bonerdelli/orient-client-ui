import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  message,
  Button,
  Col,
  Modal,
  Row,
  Skeleton,
  Spin,
  Typography,
  Form,
  Input,
  DatePicker,
  Select,
} from 'antd'

import { SelectOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import CompanyFounderInfo from 'orient-ui-library/components/CompanyFounderInfo'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderConditions, OrderConditionType } from 'orient-ui-library/library/models/orderCondition'
import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'
import { DATE_FORMAT } from 'orient-ui-library/library/helpers/date'

import OrderDocumentsList from 'components/OrderDocumentsList'
import { DocumentStatus } from 'library/models'

import { frameWizardSetDocStatus, getFrameWizardStep, sendFrameWizardStep2 } from 'library/api/frameWizard'

import './OrderStepDocuments.style.less'

const { Title } = Typography
const { useForm, Item: FormItem } = Form
const { Option } = Select

export interface OrderDocumentsProps {
  wizardType?: FrameWizardType
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepDocuments: React.FC<OrderDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  orderId,
  currentStep,
  sequenceStepNumber,
  setCurrentStep,
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

  const [ conditionCode, setConditionCode ] = useState<OrderConditionType>()
  const [ initialData, setInitialData ] = useState<OrderConditions | null>()
  const [ formDisabled, setFormDisabled ] = useState<boolean>(false)

  const [ clientCompanyFounder, setClientCompanyFounder ] = useState<CompanyFounderDto | null>(null)
  const [ companyFounderModalVisible, setCompanyFounderModalVisible ] = useState<boolean>(false)

  useEffect(() => {
    loadStepData()
  }, [ currentStep ])

  useEffect(() => {
    if (!stepData) return

    const currentDocuments = stepData?.documents ?? []
    const updatedDocuments: OrderDocument[] = []
    const updatedDocumentsOptional: OrderDocument[] = []
    const updatedDocumentTypes: number[] = []
    const updatedDocumentTypesOptional: number[] = []

    currentDocuments
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
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const sendNextStep = async () => {
    if (!orderId) {
      return
    }
    setSubmitting(true)
    // NOTE: shouldn't be sent cause statuses switches immediately
    const documentStatuses = [
      ...documentsOptional || [],
      ...documents,
    ]
      .filter(document => document.info)
      .map(document => ({
        documentId: document.info?.documentId,
        documentStatus: document.info?.documentStatus ?? DocumentStatus.NotApproved,
      }))
    const result = await sendFrameWizardStep2({
      type: wizardType,
      orderId,
    }, {
      documentStatuses,
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
      if (currentStep <= sequenceStepNumber) {
        sendNextStep()
      } else {
        setCurrentStep(sequenceStepNumber + 1)
      }
    }
  }

  const renderCancelButton = () => {
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

  const renderNextButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handleNextStep}
        disabled={!isNextStepAllowed || submitting}
        loading={submitting}
      >
        {t('orderActions.next.title')}
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
      />
    </Spin>
  )

  const renderOptionalDocumentsSection = () => (
    <Div className="OrderStepDocuments__section">
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
      />
    </Spin>
  )

  const renderOrderParametersSection = () => (
    <Div className="OrderStepDocuments__section">
      <Title level={5}>{t('orderStepDocuments.sectionTitles.orderParameters')}</Title>
      <Row>
        <Col xs={24} lg={14}>
          {renderOrderParameters()}
        </Col>
        <Col xs={24} lg={10}>
          {renderCustomerInfo()}
        </Col>
      </Row>
    </Div>
  )

  const renderOrderParameters = () => (
    <Form
      form={form}
      initialValues={initialData || undefined}
      labelWrap={true}
    >
      {renderOrderParametersFormInputs()}
      {renderOrderConditionsFormInputs()}
    </Form>
  )

  /**
   * Order condition form for a simple frame order
   */

  const isComission = () => conditionCode === OrderConditionType.Comission
  const isDiscount = () => conditionCode === OrderConditionType.Discount

  const formItemProps = {
    labelCol: { span: 10 },
  }

  const requiredRule = {
    required: true,
  }

  const renderOrderParametersFormInputs = () => (<>
    <FormItem {...formItemProps}
              name="customer"
              label={t('orderStepDocuments.orderParametersFormFields.customer.title')}>
      <Select disabled={formDisabled}
              placeholder={t('orderStepDocuments.orderParametersFormFields.customer.placeholder')}
              onChange={setConditionCode}>

      </Select>
    </FormItem>
    <FormItem {...formItemProps}
              name="bank"
              label={t('orderStepDocuments.orderParametersFormFields.bank.title')}>
      <Select disabled={formDisabled}
              placeholder={t('orderStepDocuments.orderParametersFormFields.bank.placeholder')}
              onChange={setConditionCode}>

      </Select>
    </FormItem>
  </>)

  // TODO: make a shared component with bank/src/components/OrderStepContractParams maybe
  const renderOrderConditionsFormInputs = () => (<>
    <FormItem {...formItemProps}
              name="conditionCode"
              label={t('models.orderCondition.fields.conditionCode.title')}>
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

  const renderCustomerInfo = () => (
    <></>
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
    <Div className="OrderStepDocuments__section">
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
    <Div className="OrderStepDocuments">
      <Div className="OrderStepDocuments__title">
        <Title level={4}>{t('orderStepDocuments.title')}</Title>
      </Div>
      <Div className="OrderStepDocuments__section">
        <Title level={5}>{t('orderStepDocuments.sectionTitles.mainDocs')}</Title>
        {renderDocuments()}
      </Div>
      {documentsOptional !== null && renderOptionalDocumentsSection()}
      {renderCompanyFounderSection()}
      {wizardType === FrameWizardType.Simple && renderOrderParametersSection()}
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
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepDocuments
