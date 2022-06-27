import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Table, Button, Skeleton, Tag, message } from 'antd'
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/lib/table'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { WizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { FrameOrderStatus } from 'orient-ui-library/library/models/order'
import { Bank } from 'orient-ui-library/library/models/bank'

import { StopFactor } from 'library/models/stopFactor'

interface BankWithStopFactors extends Bank {
  isOk: boolean
  stopFactors: StopFactor[]
}

interface BankStopFactor extends StopFactor {
  bankId: Bank['bankId']
  bankName: Bank['bankName']
  bankStopFactorId: string
}

import {
  getFrameWizardStep,
  sendFrameWizardStep4,
} from 'library/api/frameWizard'

import './OrderStepScoringResults.style.less'

const { Title } = Typography

export interface OrderStepScoringResultsProps {
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepScoringResults: React.FC<OrderStepScoringResultsProps> = ({
  orderId,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)
  const [ isWizardCompleted, setWizardCompleted ] = useState<boolean>(false)

  const [ stepData, setStepData ] = useState<unknown>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ scorings, setScorings ] = useState<BankWithStopFactors[] | null>(null)
  const [ defaultExpandedRowKeys, setDefaultExpandedRowKeys ] = useState<Bank['bankId'][]>([])
  const [ selectedBankIds, setSelectedBankIds ] = useState<Bank['bankId'][]>([])
  const [ selectedRowKeys, setSelectedRowKeys ] = useState<React.Key[]>([])
  const [ tableData, setTableData ] = useState<BankStopFactor[] | null>(null)

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    // TODO: ask be to generate models
    if ((stepData as any)?.banks) {
      setScorings((stepData as any).banks)
    }
  }, [stepData])

  useEffect(() => {
    setNextStepAllowed(selectedRowKeys.length > 0)
    setSelectedBankIds(selectedRowKeys as number[])
  }, [selectedRowKeys])

  useEffect(() => {
    if (!scorings) return
    let bankIds: Bank['bankId'][] = []
    let updatedTableData: BankStopFactor[] = []
    scorings.forEach(bankScoring => {
      const { bankId, bankName } = bankScoring
      const bankStopFactors = bankScoring.stopFactors.map(scoring => ({
        bankStopFactorId: `${bankId}-${scoring.stopFactorId}`,
        bankId,
        bankName,
        ...scoring,
      }))
      updatedTableData = [
        ...updatedTableData,
        ...bankStopFactors,
      ]
      bankIds.push(bankId)
    })
    setDefaultExpandedRowKeys(bankIds)
    setTableData(updatedTableData)
    // NOTE: have no idea how to check this
    // setNextStepAllowed(true)
  }, [scorings])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as WizardStepResponse<unknown>).data) // TODO: ask be to generate typings
      if ((result as any).data.orderStatus === FrameOrderStatus.FRAME_CLIENT_SIGN) {
        setWizardCompleted(true)
      }
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep4({
      orderId,
    }, {
      bankIds: selectedBankIds,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setNextStepAllowed(false)
    } else {
      setWizardCompleted(true)
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
      sendNextStep()
    }
  }

  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col flex={1}>{renderPrevButton()}</Col>
      <Col>{!isWizardCompleted && renderNextButton()}</Col>
    </Row>
  )

  const renderNextButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handleNextStep}
      disabled={!isNextStepAllowed || submitting || isWizardCompleted}
      loading={submitting}
    >
      {t('orderActions.sendToBanks.title')}
    </Button>
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

  const renderStatus = (status: boolean | null) => {
    if (status === null) {
      return <Tag>{t('dataEntity.terms.unknown')}</Tag>
    }
    if (status) {
      return <Tag color="green">{t('orderStepScoringResult.compliant.title')}</Tag>
    }
    return <Tag color="red">{t('orderStepScoringResult.nonCompliant.title')}</Tag>
  }

  const bankColumns: ColumnsType<BankWithStopFactors> = [
    {
      key: 'bankName',
      dataIndex: 'bankName',
    },
    {
      key: 'stopFactorName',
      dataIndex: 'stopFactorName',
    },
    {
      key: 'isOk',
      dataIndex: 'isOk',
      render: renderStatus,
      align: 'right',
    },
    {
      key: 'actions',
      width: 120,
    },
  ]

  const scoringColumns: ColumnsType<StopFactor> = [
    {
      key: 'stopFactorName',
      dataIndex: 'stopFactorName',
    },
    {
      key: 'isOk',
      dataIndex: 'isOk',
      render: renderStatus,
      align: 'center',
    },
    {
      key: 'actions',
      width: 120,
      render: (item) => renderStopFactorActions(item),
      align: 'right',
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: () => ({
      disabled: isWizardCompleted,
    }),
  }

  const expandedRowRender = (rowData: BankWithStopFactors) => (
    <Table
      size={'middle'}
      columns={scoringColumns}
      dataSource={rowData.stopFactors || []}
      pagination={false}
      showHeader={false}
      rowKey="stopFactorId"
    />
  )

  const renderStopFactors = () => (
    <Table
      size={'middle'}
      loading={!tableData}
      columns={bankColumns}
      rowSelection={rowSelection}
      expandable={{ expandedRowRender, defaultExpandedRowKeys }}
      dataSource={scorings || []}
      pagination={false}
      showHeader={false}
      rowKey="bankId"
    />
  )

  const renderStopFactorViewButton = (_item: StopFactor) => (
    <Button
      key="view"
      type="link"
      shape="circle"
      onClick={() => {}}
      title={t('common.actions.view.title')}
      icon={<EyeOutlined />}
      disabled={true}
    />
  )

  const renderStopFactorDownloadButton = (_item: StopFactor) => (
    <Button
      key="download"
      type="link"
      shape="circle"
      onClick={() => {}}
      title={t('common.actions.download.title')}
      icon={<DownloadOutlined />}
      disabled={true}
    />
  )

  const renderStopFactorActions = (item: StopFactor) => (
    <Div className="OrderStepScoringResults__actions">
      {renderStopFactorViewButton(item)}
      {renderStopFactorDownloadButton(item)}
    </Div>
  )

  const renderStepContent = () => (
    <Div className="OrderStepScoringResults">
      <Div className="OrderStepDocuments__section">
        <Title level={5}>{t('orderStepScoringResult.title')}</Title>
        {renderStopFactors()}
      </Div>
    </Div>
  )

  // <Div className="OrderStepDocuments__section">
  //   <Title level={5}>{t('orderStepScoringResults.sectionTitles.banksWhereTrigerred')}</Title>
  // </Div>

  if ((!stepData && stepDataLoading) || tableData === null) {
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
    <Div className="FrameWizard__step__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepScoringResults
