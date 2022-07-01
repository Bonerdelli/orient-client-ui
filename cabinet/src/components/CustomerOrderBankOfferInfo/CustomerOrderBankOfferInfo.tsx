// NOTE: this component aren't used yet

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Typography, Button, Skeleton, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import OrderConditionView from 'orient-ui-library/components/OrderCondition'
import { BankOffer, BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { BankDto } from 'orient-ui-library/library/models/proxy'

import OrderDocumentsList from 'components/OrderDocumentsList'
import { sendFrameWizardStep4 } from 'library/api/frameWizard'

import './CustomerOrderBankOfferInfo.style.less'

const { Title, Paragraph } = Typography

export interface CustomerOrderBankOfferInfoProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId?: number
  offer: BankOffer
  documents: OrderDocument[]
  bank: BankDto
  onBack: () => void
  onSuccess: () => void
}

const CustomerOrderBankOfferInfo: React.FC<CustomerOrderBankOfferInfoProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  offer,
  bank,
  documents,
  onBack,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ readyForApprove, setReadyForApprove ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ bankId, setBankId ] = useState<number>()

  useEffect(() => {
    if (!offer || !bank) return
    const currentDocuments = documents ?? []
    const updatedDocumentTypes: number[] = []
    currentDocuments.forEach((doc: OrderDocument) => {
      if (doc.isGenerated && doc.info) {
        updatedDocumentTypes.push(doc.typeId)
      }
    })
    setBankId(bank.id)
    setReadyForApprove(offer.offerStatus === BankOfferStatus.BankOfferSent)
    setDocumentTypes(updatedDocumentTypes)
  }, [offer, bank, documents])

  const handleReject = () => {
    onBack()
  }

  const handleAccept = async () => {
    if (!orderId || !companyId || !bankId) {
      return
    }
    setSubmitting(true)
    const result = await sendFrameWizardStep4({
      type: wizardType,
      companyId,
      orderId,
    }, {
      bankId,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
    } else {
      onSuccess()
      onBack()
    }
    setSubmitting(false)
  }

  const renderDocuments = () =>  (
    <OrderDocumentsList
      companyId={companyId}
      orderId={orderId as number}
      types={documentTypes || []}
      current={documents || []}
    />
  )

  const renderOfferContent = () => (
    <Div>
      <Div className="CustomerOrderBankOfferInfo__section">
        <OrderConditionView condition={offer} />
      </Div>
      <Div className="CustomerOrderBankOfferInfo__section">
        <Title level={5}>{t('orderStepBankOffer.sections.documentsForSign.title')}</Title>
        {renderDocuments()}
      </Div>
      <Div className="CustomerOrderBankOfferInfo__section">
        <Paragraph>{t('orderStepBankOffer.sections.confirmation.part1')}</Paragraph>
        <Paragraph>{t('orderStepBankOffer.sections.confirmation.part2')}</Paragraph>
      </Div>
    </Div>
  )

  const renderRejectButton = () => {
    return (
      <Button
        danger
        size="large"
        type="default"
        onClick={handleReject}
      >
        {t('orderStepBankOffer.actions.reject.title')}
      </Button>
    )
  }

  const renderAcceptButton = () => {
    return (
      <Button
        size="large"
        type="primary"
        onClick={handleAccept}
        disabled={submitting}
        loading={submitting}
      >
        {t('orderStepBankOffer.actions.accept.title')}
      </Button>
    )
  }

  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
      <Col>{renderRejectButton()}</Col>
      <Col flex={1}></Col>
      <Col>{renderAcceptButton()}</Col>
    </Row>
  )

  if (!orderId) {
    return <Skeleton />
  }

  return (
    <Div className="CustomerOrderBankOfferInfo">
      <Div className="CustomerOrderBankOfferInfo__navigateBack">
        <Button
          icon={<ArrowLeftOutlined />}
          type="link"
          size="middle"
          onClick={onBack}
        >
          {t('orderStepBankOffer.navigateBack.title')}
        </Button>
      </Div>
      <Title level={4}>
        {t('orderStepBankOffer.title', { bankName: bank?.name })}
      </Title>
      {renderOfferContent()}
      {readyForApprove && renderActions()}
    </Div>
  )
}

export default CustomerOrderBankOfferInfo
