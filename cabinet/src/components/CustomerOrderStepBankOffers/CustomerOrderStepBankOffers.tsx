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
import { getFrameWizardStep } from 'library/api/frameWizard'

import './CustomerOrderStepBankOffers.style.less'

const { Title } = Typography

export interface CustomerOrderStepBankOffersProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId?: number
  currentStep: number
  currentStepData: any // TODO: ask be to generate typings
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
  setOrderStatus: (status: OrderStatus) => void
}

interface BankOfferRow {
  offerStatus: BankOfferStatus
  bankName: string
  bankId: number
  offer: BankOffer
}

const CustomerOrderStepBankOffers: React.FC<CustomerOrderStepBankOffersProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  currentStepData,
  setCurrentStep,
  sequenceStepNumber,
  setOrderStatus,
}) => {
  const { t } = useTranslation()

  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean | null>(null)
  const [ submitting, _setSubmitting ] = useState<boolean>()

  const [ offers, setOffers ] = useState<BankOffer[]>()
  const [ offersTableData, setOffersTableData ] = useState<BankOfferRow[]>()
  const [ selectedOffer, setSelectedOffer ] = useState<BankOffer | null>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (stepData?.offers) {
      setOffers(stepData.offers)

    }
  }, [ stepData ])

  useEffect(() => {
    if (currentStepData?.offers) {
      setStepData(currentStepData)
    }
  }, [ currentStepData ])

  useEffect(() => {
    if (offers) {
      const updatedOffers = offers.map((offer: BankOffer) => ({
        offerStatus: offer.offerStatus,
        bankName: offer.bank.name,
        bankId: offer.bank.id,
        offer,
      }))
      setOffersTableData(updatedOffers)
      setDataLoaded(true)
    }
  }, [ offers ])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      type: wizardType,
      step: sequenceStepNumber,
      companyId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<any>).data) // TODO: ask be to generate typings
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
        onClick={() => setSelectedOffer(item.offer)}
        icon={<EyeOutlined/>}
      />
    </Space>
  )

  const renderOfferStatus = (status: BankOfferStatus) => {
    switch (status) {
      case BankOfferStatus.BankWaitForVerify:
      case BankOfferStatus.BankViewed:
      case BankOfferStatus.BankVerify:
      case BankOfferStatus.BankSign:
      case BankOfferStatus.BankOffer:
        return <Tag color="blue">{t('offerStatusTitles.bankVerify')}</Tag>
      case BankOfferStatus.BankOfferSent:
        return <Tag color="green">{t('offerStatusTitles.bankOfferSent')}</Tag>
      case BankOfferStatus.CustomerSign:
        return <Tag color="blue">{t('offerStatusTitles.customerSign')}</Tag>
      case BankOfferStatus.Completed:
        return <Tag color="blue">{t('offerStatusTitles.completed')}</Tag>
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
      title: t('common.dataEntity.actions'),
      align: 'left',
      width: 100,
    },
  ]

  const renderStepContent = () => (
    <Div className="CustomerOrderStepBankOffers">
      <Div className="WizardStep__section">
        <Title level={5}>{t('frameSteps.bankOffers.bankList.title')}</Title>
        <Table
          size={'middle'}
          columns={columns}
          loading={dataLoaded === null}
          dataSource={offersTableData || []}
          pagination={false}
          showHeader={false}
        />
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
    // TODO: make slide transition when navigate
    return (
      <CustomerOrderBankOfferInfo
        offer={selectedOffer}
        companyId={companyId}
        orderId={orderId}
        stepNumber={sequenceStepNumber}
        onBack={() => setSelectedOffer(null)}
        onSuccess={() => loadCurrentStepData()}
      />
    )
  }

  return (
    <Div className="WizardStep__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default CustomerOrderStepBankOffers
