import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col, Typography, Button, Skeleton, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import OrderConditionView from 'orient-ui-library/components/OrderCondition'
import { BankOffer, BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderDocument } from 'orient-ui-library/library/models/document'
import { OrderStatus } from 'orient-ui-library/library/models/order'
import { BankDto } from 'orient-ui-library/library/models/proxy'

import OrderDocumentsToSignList from 'components/OrderDocumentsToSignList'
import { sendFrameWizardStep } from 'library/api/frameWizard'
import { CabinetMode } from 'library/models/cabinet'

import './CustomerOrderBankOfferInfo.style.less'

const { Title } = Typography

export interface CustomerOrderBankOfferInfoProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId?: number
  stepNumber: number
  offer: BankOffer
  onBack: () => void
  onSuccess: () => void
}

const CustomerOrderBankOfferInfo: React.FC<CustomerOrderBankOfferInfoProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  stepNumber,
  offer,
  onBack,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const [ readyForApprove, setReadyForApprove ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ bankId, setBankId ] = useState<number>()

  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ bankOfferStatus, setBankOfferStatus ] = useState<BankOfferStatus | null>(null)

  useEffect(() => {
    if (!offer) return
    const currentDocuments = offer?.documents ?? []
    const updatedDocumentTypes: number[] = []
    currentDocuments.forEach((doc: OrderDocument) => {
      if (doc.isGenerated && doc.info) {
        updatedDocumentTypes.push(doc.typeId)
      }
    })
    setBankId(offer.bank.id)
    setBankOfferStatus(offer.offerStatus)
    setDocumentTypes(updatedDocumentTypes)
  }, [ offer ])

  useEffect(() => {
    setReadyForApprove(bankOfferStatus === BankOfferStatus.CustomerSign)
  }, [bankOfferStatus])

  const handleAccept = async () => {
    if (!orderId || !companyId || !bankId) {
      return
    }
    setSubmitting(true)
    const result = await sendFrameWizardStep({
      mode: CabinetMode.Customer,
      type: wizardType,
      step: stepNumber,
      companyId: companyId as number,
      orderId,
    }, {
      bankId,
    })
    if (!result.success) {
      message.error(t('common.errors.requestError.title'))
      setReadyForApprove(false)
    } else {
      onSuccess && onSuccess()
      message.success(t('orderStepBankOffer.statuses.completed.title'))
      setReadyForApprove(false)
    }
    setSubmitting(false)
  }

  const renderDocuments = () =>  (
    <OrderDocumentsToSignList
      companyId={companyId}
      orderId={orderId as number}
      types={documentTypes || []}
      checkSignedFn={document => document.info?.customerSigned === true}
      current={offer.documents || []}
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
    </Div>
  )

  const renderAcceptButton = () => (
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

  const renderActions = () => (
    <Row className="FrameWizard__step__actions">
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
        {/*t('orderStepBankOffer.title', { bankName: bank?.name })*/}
      </Title>
      {renderOfferContent()}
      {readyForApprove && renderActions()}
    </Div>
  )
}

export default CustomerOrderBankOfferInfo
