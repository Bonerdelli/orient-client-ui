import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography, Row, Col, Button, Skeleton, Table, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import { OrderStatus } from 'orient-ui-library/library/models/order'
import { BankOffer, BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { FrameWizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'

import CustomerOrderBankOfferInfo from 'components/CustomerOrderBankOfferInfo'
import CompanyDataReadyStatuses from 'components/CompanyDataReadyStatuses'

import {
  BankRequisitesTableData,
  companyDataInitialStatus,
} from 'components/CompanyDataReadyStatuses/CompanyDataReadyStatuses'

import {
  getCompanyRequisitesList,
} from 'library/api'

import { CabinetMode } from 'library/models/cabinet'
import { getFrameWizardStep } from 'library/api/frameWizard'

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

  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ companyDataStatus, setСompanyDataStatus ] = useState({ ...companyDataInitialStatus })
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ _completed, setCompleted ] = useState<boolean>()

  const [ offers, setOffers ] = useState<BankOffer[]>()
  const [ offersTableData, setOffersTableData ] = useState<BankOfferRow[]>()
  const [ selectedOffer, setSelectedOffer ] = useState<any>() // TODO: ask be to generate typings
  const [ requisitesList, setRequisitesList ] = useState<BankRequisitesTableData[]>([])

  useEffect(() => {
    loadCurrentStepData()
    if (orderStatus === OrderStatus.FRAME_CUSTOMER_SIGN) {
      loadCompanyBankRequisites()
    }
  }, [])

  useEffect(() => {
    const updatedCompanyStatus = {
      companyHead: Boolean(stepData?.customerCompanyFounder),
      bankRequisites: Boolean(stepData?.customerCompanyRequisites),
      questionnaire: Boolean(stepData?.customerCompanyQuestionnaire),
    }
    setСompanyDataStatus(updatedCompanyStatus)
  }, [ stepData ])

  useEffect(() => {
    if (stepData?.bankOffers) {
      setOffers(stepData.bankOffers)
    }
  }, [ stepData ])

  useEffect(() => {
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
      setOffersTableData(updatedOffers)
      setDataLoaded(true)
    }
  }, [ offers ])

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

  const handlePrevStep = () => {
    if (isPrevStepAllowed) {
      setCurrentStep(sequenceStepNumber - 1)
    }
  }

  const loadCompanyBankRequisites = async () => {
    if (!companyId) return

    const res = await getCompanyRequisitesList({ companyId })
    if (res.success) {
      const list = res.data?.map(requisites => ({ ...requisites, key: requisites.id! })) ?? []
      setRequisitesList(list)
    }
  }

  const renderActions = () => (
    <Row className="WizardStep__actions">
      <Col flex={1}>{renderPrevButton()}</Col>
    </Row>
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

  const renderColumnActions = (_val: unknown, item: BankOfferRow) => (
    <Space size="small">
      <Button
        key="view"
        type="link"
        shape="circle"
        title={t('common.actions.view.title')}
        onClick={() => setSelectedOffer(item)}
        icon={<EyeOutlined/>}
      />
    </Space>
  )

  const renderOfferStatus = (status: BankOfferStatus) => {
    switch (status) {
      case BankOfferStatus.CustomerSign:
        return <Tag color="blue">{t('orderStatusCustomerTitles.customerSign')}</Tag>
      case BankOfferStatus.Completed:
        return <Tag color="blue">{t('orderStatusCustomerTitles.completed')}</Tag>
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
      render: renderColumnActions,
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
        <Title level={5}>{t('customerOrderStepDocuments.sections.companyData.title')}</Title>
        <CompanyDataReadyStatuses requisitesList={requisitesList} companyDataStatus={companyDataStatus}/>
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
    return (
      <CustomerOrderBankOfferInfo
        offer={selectedOffer.offer}
        bank={selectedOffer.bank}
        stepNumber={sequenceStepNumber}
        orderStatus={orderStatus as OrderStatus}
        documents={stepData.documents}
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
