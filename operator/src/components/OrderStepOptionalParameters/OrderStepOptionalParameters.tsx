/**
 * NOTE: not used in Demo
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Row, Col, Table, Button, Skeleton, message } from 'antd'
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import type { ColumnsType } from 'antd/lib/table'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'

import { OptionalParameter } from 'library/models/optionalParameter'
import { getControlColorByState } from 'orient-ui-library/library/helpers/control'

import {
  getFrameWizardStep,
  sendFrameWizardStep3, // NOTE: replace ep with correct one!
} from 'library/api/frameWizard'

import './OrderStepOptionalParameters.style.less'

const { Title } = Typography

export interface OrderStepOptionalParametersProps {
  orderId?: number
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepOptionalParameters: React.FC<OrderStepOptionalParametersProps> = ({
  orderId,
  currentStep,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isNextStepAllowed, setNextStepAllowed ] = useState<boolean>(false)
  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<unknown>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()

  const [ optionalParameters, setOptionalParameters ] = useState<OptionalParameter[] | null>(null)

  useEffect(() => {
    loadCurrentStepData()
  }, [])

  useEffect(() => {
    if (currentStep > sequenceStepNumber) {
      // NOTE: only for debugging
      setNextStepAllowed(true)
    }
  }, [ currentStep, sequenceStepNumber ])


  useEffect(() => {
    // TODO: ask be to generate models
    if ((stepData as any)?.optionalParameters) {
      setOptionalParameters((stepData as any).optionalParameters)
    }
  }, [ stepData ])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
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
    setNextStepAllowed(true) // NOTE: only for debugging
  }

  const sendNextStep = async () => {
    if (!orderId) return
    setSubmitting(true)
    const result = await sendFrameWizardStep3({ // NOTE: replace ep with correct!
      orderId,
    }, {})
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
      sendNextStep()
    }
  }

  const renderActions = () => (
    <Row className="WizardStep__actions">
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
      {t('orderActions.saveAndContinue.title')}
    </Button>
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

  const stopFactorColumns: ColumnsType<OptionalParameter> = [
    {
      key: 'stopFactorName',
      dataIndex: 'stopFactorName',
      title: '',
      width: 'auto',
    },
    {
      key: 'updatedDate',
      dataIndex: 'updatedDate',
      title: '',
      render: () => '', // NOTE: have no update time
      align: 'center',
    },
    {
      key: 'isOk',
      dataIndex: 'isOk',
      title: '',
      render: () => 'Неизвестно',
      align: 'center',
    },
    {
      key: 'actions',
      render: () => renderStopFactorActions(),
      title: t('common.dataEntity.actions'),
      align: 'left',
      width: 120,
    },
  ]

  const renderOptionalParameters = () => (
    <Table
      size={'middle'}
      loading={!optionalParameters}
      columns={stopFactorColumns}
      dataSource={optionalParameters || []}
      pagination={false}
      showHeader={false}
      rowKey="stopFactorId"
    />
  )

  const renderStopFactorApproveButton = () => (
    <Button
      key="approve"
      type="link"
      shape="circle"
      title={t('common.actions.approve.title')}
      icon={<CheckCircleTwoTone twoToneColor={getControlColorByState(true)}/>}
    />
  )

  const renderStopFactorRejectButton = () => (
    <Button
      danger
      key="reject"
      type="link"
      shape="circle"
      title={t('common.actions.reject.title')}
      icon={<CloseCircleTwoTone twoToneColor={getControlColorByState(false)}/>}
    />
  )

  const renderStopFactorActions = () => (
    <>
      {renderStopFactorApproveButton()}
      {renderStopFactorRejectButton()}
    </>
  )

  const renderStepContent = () => (
    <Div className="OrderStepOptionalParameters">
      <Div className="WizardStep__section">
        <Title level={5}>{t('orderStepOptionalParameters.sectionTitles.optionalParameters')}</Title>
        {renderOptionalParameters()}
      </Div>
    </Div>
  )

  // <Div className="WizardStep__section">
  //   <Title level={5}>{t('orderStepOptionalParameters.sectionTitles.banksWhereTrigerred')}</Title>
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
    <Div className="WizardStep__content">
      {renderStepContent()}
      {renderActions()}
    </Div>
  )
}

export default OrderStepOptionalParameters
