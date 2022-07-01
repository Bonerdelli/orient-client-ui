import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Result, Typography, Button, Skeleton } from 'antd'
import { ArrowLeftOutlined, ClockCircleFilled } from '@ant-design/icons'

import OrderConditionView from 'orient-ui-library/components/OrderCondition'
import { BankOffer, BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { OrderDocument } from 'orient-ui-library/library/models/document'

import Div from 'orient-ui-library/components/Div'
import OrderDocumentsList from 'components/OrderDocumentsList'

import './OrderBankOfferInfo.style.less'

const { Title, Paragraph } = Typography

export interface OrderBankOfferInfoProps {
  companyId: number
  orderId?: number
  offer: BankOffer
  onBack: () => void
}

const OrderBankOfferInfo: React.FC<OrderBankOfferInfoProps> = ({
  companyId,
  orderId,
  offer,
  onBack,
}) => {
  const { t } = useTranslation()
  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ readyForApprove, setReadyForApprove ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<false>()

  useEffect(() => {
    if (!offer) return
    const currentDocuments = offer?.documents ?? []
    const updatedDocumentTypes: number[] = []
    currentDocuments.forEach((doc: OrderDocument) => {
      if (doc.isGenerated && doc.info) {
        updatedDocumentTypes.push(doc.typeId)
      }
    })
    setReadyForApprove(offer.offerStatus === BankOfferStatus.BankOfferSent)
    setDocumentTypes(updatedDocumentTypes)
  }, [offer])

  const handleReject = () => {
    onBack()
  }
  const handleAccept = () => {
    onBack()
  }

  const renderDocuments = () =>  (
    <OrderDocumentsList
      companyId={companyId}
      orderId={orderId as number}
      types={documentTypes || []}
      current={offer.documents || []}
    />
  )

  const renderHasOfferContent = () => (
    <Div>
      <Div className="OrderBankOfferInfo__section">
        <OrderConditionView condition={offer.conditions} />
      </Div>
      <Div className="OrderBankOfferInfo__section">
        <Title level={5}>{t('orderStepBankOffer.sections.documentsForSign.title')}</Title>
        {renderDocuments()}
      </Div>
      <Div className="OrderBankOfferInfo__section">
        <Paragraph>{t('orderStepBankOffer.sections.confirmation.part1')}</Paragraph>
        <Paragraph>{t('orderStepBankOffer.sections.confirmation.part2')}</Paragraph>
      </Div>
    </Div>
  )

  const renderOfferContent = () => {
    if (readyForApprove) {
      return renderHasOfferContent()
    }
    return (
      <Result
        icon={<ClockCircleFilled />}
        title={t('orderStepBankOffer.statuses.waitingForBank.title')}
        subTitle={t('orderStepBankOffer.statuses.waitingForBank.desc')}
      />
    )
  }

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
    <Div className="OrderBankOfferInfo">
      <Div className="OrderBankOfferInfo__navigateBack">
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
        {t('orderStepBankOffer.title', { bankName: offer.bank.name })}
      </Title>
      {renderOfferContent()}
      {readyForApprove && renderActions()}
    </Div>
  )
}

export default OrderBankOfferInfo
