import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Button, Skeleton, Table, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { EyeOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { WizardStepResponse, FrameWizardType } from 'orient-ui-library/library/models/wizard'

import { getFrameWizardStep } from 'library/api/frameWizard'

import './OrderStepBankOffers.style.less'

const { Title } = Typography

export interface OrderStepBankOffersProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepBankOffers: React.FC<OrderStepBankOffersProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<any>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, _setSubmitting ] = useState<boolean>()
  const [ offers, setOffers ] = useState<any[]>()

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    let updatedOffers = []
    if (stepData?.offers) {
      updatedOffers = stepData.offers.map((offer: any) => ({
        offerStatus: offer.offerStatus,
        bankName: offer.bank.name,
        banId: offer.bank.id,
      }))
    }
    setOffers(updatedOffers)
  }, [stepData])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      type: wizardType,
      step: sequenceStepNumber,
      companyId,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as WizardStepResponse<unknown>).data) // TODO: ask be to generate typings
      setDataLoaded(true)
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
      disabled={submitting}
      loading={submitting}
    >
      {t('common.actions.back.title')}
    </Button>
  )

  const renderColumnActions = (_val: unknown, _item: any) => (
    <Space size="small">
      <Button
        key="view"
        type="link"
        shape="circle"
        title={t('common.actions.view.title')}
        icon={<EyeOutlined />}
      />
    </Space>
  )

  const columns: ColumnsType<any> = [
    {
      key: 'bankName',
      dataIndex: 'bankName',
    },
    {
      key: 'offerStatus',
      dataIndex: 'offerStatus',
      render: () => <Tag color="blue">На проверке</Tag>
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
        <Title level={5}>{t('frameSteps.bankOffers.bankList.title')}</Title>
        <Table
          size={'middle'}
          columns={columns}
          loading={dataLoaded === null}
          dataSource={offers || []}
          pagination={false}
          showHeader={false}
        />
      </Div>
    </Div>
  )

  if (!stepData && stepDataLoading) {
    return (
      <Skeleton active={true} />
    )
  }

  if (dataLoaded === false) {
    return (
      <ErrorResultView centered status="warning" />
    )
  }

  return (
    <Div className="WizardStep__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepBankOffers
