import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, message, Row, Skeleton, Table, Tag, Typography } from 'antd'
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import type { ColumnsType } from 'antd/lib/table'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { formatDate } from 'orient-ui-library/library/helpers/date'
import { getControlColorByState } from 'orient-ui-library/library/helpers/control'

import { StopFactor } from 'library/models/stopFactor'

import {
  factoringWizardSetStopFactor,
  getFactoringWizardStep,
  sendFactoringWizardStep,
} from 'library/api/factoringWizard'

import './FactoringStepStopFactors.style.less'

const { Title } = Typography

export interface FactoringStepStopFactorsProps {
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const FactoringStepStopFactors: React.FC<FactoringStepStopFactorsProps> = ({
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()
  const [ approveInProccess, setApproveInProccess ] = useState<Record<StopFactor['stopFactorId'], boolean>>({})
  const [ rejectInProccess, setRejectInProccess ] = useState<Record<StopFactor['stopFactorId'], boolean>>({})

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<unknown>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ stopFactors, setStopFactors ] = useState<StopFactor[] | null>(null)

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    // TODO: ask be to generate models
    if ((stepData as any)?.stopFactors) {
      setStopFactors((stepData as any).stopFactors)
    }
  }, [ stepData ])

  useEffect(() => {
    if (!stopFactors) return
    let allChecked = true
    for (let i = 0; i < stopFactors.length; i++) {
      if (stopFactors[i].isOk === null) {
        allChecked = false
        break
      }
    }
    setNextStepAllowed(allChecked)
  }, [ stopFactors ])

  const loadCurrentStepData = async () => {
    const result = await getFactoringWizardStep({
      step: sequenceStepNumber,
      orderId,
    })
    if (result.success) {
      setStepData((result.data as FrameWizardStepResponse<unknown>).data) // TODO: ask be to generate typings
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
    setStepDataLoading(false)
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFactoringWizardStep({
      orderId,
      step: sequenceStepNumber,
    }, {
      // NOTE: shouldn't be sent cause statuses switches immediately
      stopFactors,
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
    if (currentStep <= sequenceStepNumber) {
      sendNextStep()
    } else {
      setCurrentStep(sequenceStepNumber + 1)
    }
  }

  const handleApprove = async (item: StopFactor) => {
    const { stopFactorId } = item
    setApproveInProccess({
      ...approveInProccess,
      [stopFactorId]: true,
    })
    const result = await factoringWizardSetStopFactor({
      orderId,
    }, {
      stopFactorId,
      isOk: true,
    })
    if (!result) {
      message.error(
        t('common.errors.requestError.title'),
      )
    } else {
      await loadCurrentStepData()
    }
    setApproveInProccess({
      ...approveInProccess,
      [stopFactorId]: false,
    })
  }

  const handleReject = async (item: StopFactor) => {
    const { stopFactorId } = item
    setRejectInProccess({
      ...rejectInProccess,
      [stopFactorId]: true,
    })
    const result = await factoringWizardSetStopFactor({
      orderId,
    }, {
      stopFactorId,
      isOk: false,
    })
    if (!result) {
      message.error(
        t('common.errors.requestError.title'),
      )
    } else {
      await loadCurrentStepData()
    }
    setRejectInProccess({
      ...rejectInProccess,
      [stopFactorId]: false,
    })
  }

  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col flex={1}>{renderPrevButton()}</Col>
      <Col>{renderNextButton()}</Col>
    </Row>
  )

  const renderNextButton = () => (
    <Button
      size="large"
      type="primary"
      onClick={handleNextStep}
      disabled={!isNextStepAllowed || submitting}
      loading={submitting}
    >
      {t('common.actions.next.title')}
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
      return <Tag>{t('common.documents.statuses.notChecked')}</Tag>
    }
    if (status) {
      return <Tag color="green">{t('common.documents.statuses.approved')}</Tag>
    }
    return <Tag color="red">{t('common.documents.statuses.notApproved')}</Tag>
  }

  const stopFactorColumns: ColumnsType<StopFactor> = [
    {
      key: 'stopFactorName',
      dataIndex: 'stopFactorName',
      width: 'auto',
    },
    {
      key: 'updatedDate',
      dataIndex: 'updatedDate',
      render: (val) => val ? formatDate(val) : '',
      align: 'center',
    },
    {
      key: 'isOk',
      dataIndex: 'isOk',
      render: renderStatus,
      width: 120,
      align: 'center',
    },
    {
      key: 'actions',
      render: (item) => renderStopFactorActions(item),
      title: t('common.dataEntity.actions'),
      align: 'left',
      width: 80,
    },
  ]

  const renderStopFactors = () => (
    <Table
      size={'middle'}
      loading={!stopFactors}
      columns={stopFactorColumns}
      dataSource={stopFactors || []}
      pagination={false}
      showHeader={false}
      rowKey="stopFactorId"
    />
  )

  const renderStopFactorApproveButton = (item: StopFactor) => (
    <Button
      key="approve"
      type="link"
      shape="circle"
      title={t('common.actions.approve.title')}
      onClick={() => handleApprove(item)}
      loading={approveInProccess[item.stopFactorId]}
      disabled={stepDataLoading || rejectInProccess[item.stopFactorId] || item.isOk === true}
      icon={<CheckCircleTwoTone twoToneColor={getControlColorByState(item.isOk !== true ? true : null)}/>}
    />
  )

  const renderStopFactorRejectButton = (item: StopFactor) => (
    <Button
      danger
      key="reject"
      type="link"
      shape="circle"
      title={t('common.actions.reject.title')}
      onClick={() => handleReject(item)}
      loading={rejectInProccess[item.stopFactorId]}
      disabled={stepDataLoading || approveInProccess[item.stopFactorId] || item.isOk === false}
      icon={<CloseCircleTwoTone twoToneColor={getControlColorByState(item.isOk !== false ? false : null)}/>}
    />
  )

  const renderStopFactorActions = (item: StopFactor) => (
    <Div className="FactoringStepStopFactors__actions">
      {renderStopFactorApproveButton(item)}
      {renderStopFactorRejectButton(item)}
    </Div>
  )

  const renderStepContent = () => (
    <Div className="FactoringStepStopFactors">
      <Div className="FactoringStepDocuments__section">
        <Title level={5}>{t('orderStepStopFactors.sectionTitles.stopFactors')}</Title>
        {renderStopFactors()}
      </Div>
    </Div>
  )

  // <Div className="FactoringStepDocuments__section">
  //   <Title level={5}>{t('orderStepStopFactors.sectionTitles.banksWhereTrigerred')}</Title>
  // </Div>

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

export default FactoringStepStopFactors
