import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { every } from 'lodash'

import { Typography, Row, Col, Button, Skeleton, Table, Space, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { OrderStatus } from 'orient-ui-library/library/models/order'
import { BankOffer, BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { FrameWizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderDocument } from 'orient-ui-library/library/models/document'

import OrderDocumentsList from 'components/OrderDocumentsList'
import CustomerOrderBankOfferInfo from 'components/CustomerOrderBankOfferInfo'
import CompanyDataReadyStatuses from 'components/CompanyDataReadyStatuses'
import { companyDataInitialStatus } from 'components/CompanyDataReadyStatuses/CompanyDataReadyStatuses'

import { CabinetMode } from 'library/models/cabinet'
import { getFrameWizardStep, sendFrameWizardStep } from 'library/api/frameWizard'

import './CustomerOrderSignDocuments.style.less'

const { Title } = Typography

interface BankOfferRow {
  offerStatus: BankOfferStatus
  bankName: string
  bankId: number
  offer: BankOffer
}

export interface CustomerOrderSignDocumentsProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: OrderStatus) => void
  orderStatus?: OrderStatus
}

const CustomerOrderSignDocuments: React.FC<CustomerOrderSignDocumentsProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  setCurrentStep,
  sequenceStepNumber,
  setOrderStatus,
  orderStatus,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ companyDataStatus, setСompanyDataStatus ] = useState({ ...companyDataInitialStatus })
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ completed, setCompleted ] = useState<boolean>()

  const [ offers, setOffers ] = useState<BankOffer[]>()
  const [ offersTableData, setOffersTableData ] = useState<BankOfferRow[]>()
  const [ selectedOffer, setSelectedOffer ] = useState<any>() // TODO: ask be to generate typings
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ bankId, setBankId ] = useState<number>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    const currentDocuments = stepData?.documents ?? []
    const updatedDocumentTypes: number[] = []
    currentDocuments.forEach((doc: OrderDocument) => {
      if (doc.isGenerated && doc.info) {
        updatedDocumentTypes.push(doc.typeId)
      }
    })
    const updatedCompanyStatus = {
      companyHead: Boolean(stepData?.customerCompanyFounder),
      bankRequisites: Boolean(stepData?.customerCompanyRequisites),
      questionnaire: Boolean(stepData?.customerCompanyQuestionnaire),
    }
    const isCompanyDataReady = every(updatedCompanyStatus, Boolean)
    setNextStepAllowed(isCompanyDataReady)
    setСompanyDataStatus(updatedCompanyStatus)
    setDocumentTypes(updatedDocumentTypes)
  }, [ stepData ])

  useEffect(() => {
    if (stepData?.bankOffers) {
      setOffers(stepData.bankOffers)
    }
  }, [ stepData ])

  useEffect(() => {
    console.log('orderStatus', orderStatus)
    if (orderStatus === OrderStatus.FRAME_COMPLETED) {
      setCompleted(true)
    }
  }, [ orderStatus ])

  useEffect(() => {
    if (offers) {
      // NOTE: various model with Client cabinet
      const updatedOffers = offers.map((offer: any) => ({
        mode: CabinetMode.Customer,
        offerStatus: offer.offer.status,
        bankName: offer.bank.name,
        bankId: offer.bank.id,
        offer: offer.offer,
        bank: offer.bank,
      }))
      setBankId(updatedOffers[0].bankId) // NOTE: workaround for a single bank scenario
      setOffersTableData(updatedOffers)
      setDataLoaded(true)
    }
  }, [ offers ])

  const handleSign = async () => {
    if (!orderId || !bankId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep({
      mode: CabinetMode.Customer,
      type: wizardType,
      step: sequenceStepNumber,
      companyId: companyId as number,
      orderId,
    }, {
      bankId,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      message.success(t('orderStepBankOffer.statuses.completed.title'))
      loadCurrentStepData()
      setCompleted(true)
    }
    setSubmitting(false)
  }

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      mode: CabinetMode.Customer,
      type: wizardType,
      step: sequenceStepNumber,
      companyId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<unknown>).data) // TODO: ask be to generate typings
      setOrderStatus((result.data as FrameWizardStepResponse<any>).orderStatus as OrderStatus)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const handleNextStep = () => {
    if (isNextStepAllowed) {
      handleSign()
    }
  }

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(sequenceStepNumber - 1)
    }
  }

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col flex={1}>{renderPrevButton()}</Col>
      <Col>{!completed && renderSubmitButton()}</Col>
    </Row>
  )

  const renderSubmitButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handleNextStep}
        disabled={!isNextStepAllowed || submitting}
        loading={submitting}
      >
        {t('orders.actions.signAndSubmit.title')}
      </Button>
    )
  }

  const renderPrevButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handlePrevStep}
    >
      {t('common.actions.back.title')}
    </Button>
  )

  const renderColumnActions = (_val: unknown, item: BankOfferRow) => (
    <Space size="small">
      <Button
        key="view"
        type="link"
        shape="circle"
        title={t('common.actions.view.title')}
        onClick={() => setSelectedOffer(item.offer)}
        icon={<EyeOutlined/>}
      />
    </Space>
  )

  const renderDocuments = () => (
    <OrderDocumentsList
      companyId={companyId}
      orderId={orderId as number}
      types={documentTypes || []}
      current={stepData?.documents || []}
    />
  )

  const renderOfferStatus = (status: BankOfferStatus) => {
    switch (status) {
      case BankOfferStatus.CustomerSign:
        return <Tag color="blue">{t('orderStatusCustomerTitles.customerSign')}</Tag>
      case BankOfferStatus.Completed:
        return <Tag>{t('orderStatusCustomerTitles.completed')}</Tag>
      default:
        return <></>
    }
  }

  const columns: ColumnsType<BankOfferRow> = [
    {
      key: 'bankName',
      dataIndex: 'bankName',
    },
    {
      key: 'offerStatus',
      dataIndex: 'offerStatus',
      render: renderOfferStatus,
      align: 'center',
      width: 120,
    },
    {
      key: 'actions',
      // TODO: enable for multiple banks scenario
      // render: renderColumnActions,
      align: 'right',
      width: 100,
    },
  ]

  const renderStepContent = () => (
    <Div className="OrderStepBankOffers">
      <Div className="WizardStep__section">
        <Title level={5}>{t('customerOrderStepDocuments.sections.selectBank.title')}</Title>
        <Table
          size={'middle'}
          columns={columns}
          loading={dataLoaded === null}
          dataSource={offersTableData || []}
          pagination={false}
          showHeader={false}
        />
      </Div>
      <Div className="WizardStep__section">
        <Title level={5}>{t('customerOrderStepDocuments.sections.documentsForSign.title')}</Title>
        {renderDocuments()}
      </Div>
      <Div className="WizardStep__section">
        <Title level={5}>{t('customerOrderStepDocuments.sections.companyData.title')}</Title>
        <CompanyDataReadyStatuses companyDataStatus={companyDataStatus}/>
      </Div>
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

  if (selectedOffer) {
    // TODO: use this for multiple banks scenario
    // TODO: make slide transition when navigate
    return (
      <CustomerOrderBankOfferInfo
        offer={selectedOffer.offer}
        bank={selectedOffer.bank}
        documents={stepData?.documents}
        companyId={companyId}
        orderId={orderId}
        onBack={() => setSelectedOffer(null)}
        onSuccess={() => loadCurrentStepData()}
      />
    )
  }

  if (!stepData && stepDataLoading) {
    return (
      <Skeleton active={true}/>
    )
  }

  return (
    <Div className="WizardStep__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default CustomerOrderSignDocuments
