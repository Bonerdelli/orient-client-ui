import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Button, Skeleton, Result } from 'antd'
import { InfoCircleFilled, CheckCircleFilled } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { FrameWizardStepResponse } from 'orient-ui-library/library/models/wizard'
import { BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'

import { getFrameWizardStep } from 'library/api/frameWizard'

import './OrderStepOfferAcceptance.style.less'

export interface BlankWizardStepProps {
  bankId?: number | bigint
  orderId?: number
  offerStatus?: BankOfferStatus
  currentStep: number
  sequenceStepNumber: number
  setCurrentStep: (step: number) => void
}

const OrderStepOfferAcceptance: React.FC<BlankWizardStepProps> = ({
  bankId,
  orderId,
  offerStatus,
  setCurrentStep,
  sequenceStepNumber,
}) => {
  const { t } = useTranslation()

  const [ isPrevStepAllowed, _setPrevStepAllowed ] = useState<boolean>(true)

  const [ stepData, setStepData ] = useState<unknown>() // TODO: ask be to generate typings
  const [ stepDataLoading, setStepDataLoading ] = useState<boolean>()
  const [ dataLoaded, setDataLoaded ] = useState<boolean>()
  const [ isWaiting, setWaiting ] = useState<boolean>()
  const [ isAccepted, setAccepted ] = useState<boolean>()

  useEffect(() => {
    if (isWaiting === false) {
      loadCurrentStepData()
    }
  }, [ isWaiting ])

  useEffect(() => {
    if (offerStatus) {
      setWaiting(offerStatus === BankOfferStatus.CustomerSign)
      setAccepted(offerStatus === BankOfferStatus.Completed)
    }
  }, [ offerStatus ])

  const loadCurrentStepData = async () => {
    const result = await getFrameWizardStep({
      step: sequenceStepNumber,
      bankId,
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

  const renderStepContent = () => (
    <Div className="OrderStepOfferAcceptance">
      <Result
        icon={<InfoCircleFilled/>}
        title={t('orderStepOfferAcceptance.waitForAccept.title')}
        subTitle={t('orderStepOfferAcceptance.waitForAccept.desc')}
      />
    </Div>
  )

  if (isWaiting) {
    return (
      <Result
        icon={<InfoCircleFilled/>}
        title={t('orderStepOfferAcceptance.waitForAccept.title')}
        subTitle={t('orderStepOfferAcceptance.waitForAccept.desc')}
      />
    )
  }

  if (isAccepted) {
    return (
      <Result
        icon={<CheckCircleFilled />}
        title={t('orderStepOfferAcceptance.accepted.title')}
      />
    )
  }

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

export default OrderStepOfferAcceptance
