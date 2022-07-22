import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sortBy } from 'lodash'

import { Button, Col, message, Result, Row, Skeleton, Typography } from 'antd'
import { ArrowLeftOutlined, ClockCircleFilled } from '@ant-design/icons'

import Div from 'orient-ui-library/components/Div'
import OrderConditionView from 'orient-ui-library/components/OrderCondition'
import { BankOffer, BankOfferStatus } from 'orient-ui-library/library/models/bankOffer'
import { FrameWizardType } from 'orient-ui-library/library/models/wizard'
import { OrderDocument } from 'orient-ui-library/library/models/document'

import OrderDocumentsToSignList from 'components/OrderDocumentsToSignList'
import { sendFrameWizardStep4 } from 'library/api/frameWizard'

import './ClientOrderBankOfferInfo.style.less'
import { useHistory } from 'react-router-dom'
import { FACTORING_ORDER_ID_PARAM, OFFER_BANK_ID_PARAM } from 'library/constants'

const { Title, Paragraph } = Typography


const DOCUMENTS_TO_SHOW = [
  9, // Рамочный договор
  17, // Индивидуальные условия
]

export interface ClientOrderBankOfferInfoProps {
  wizardType?: FrameWizardType
  companyId: number
  orderId?: number
  offer: BankOffer
  onBack: () => void
  onSuccess: () => void
}

const ClientOrderBankOfferInfo: React.FC<ClientOrderBankOfferInfoProps> = ({
  wizardType = FrameWizardType.Full,
  companyId,
  orderId,
  offer,
  onBack,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const history = useHistory()

  const [ documentTypes, setDocumentTypes ] = useState<number[] | null>(null)
  const [ bankOfferStatus, setBankOfferStatus ] = useState<BankOfferStatus | null>(null)
  const [ submitting, setSubmitting ] = useState<boolean>()
  const [ bankId, setBankId ] = useState<number>()

  useEffect(() => {
    if (!offer) return
    const currentDocuments = offer?.documents ?? []
    const updatedDocumentTypes: number[] = []
    sortBy(currentDocuments, 'priority')
      .filter((doc: OrderDocument) => DOCUMENTS_TO_SHOW.includes(doc.typeId))
      .forEach((doc: OrderDocument) => {
        if (doc.isGenerated && doc.info) {
          updatedDocumentTypes.push(doc.typeId)
        }
      })
    setBankId(offer.bank.id)
    setBankOfferStatus(offer.offerStatus)
    setDocumentTypes(updatedDocumentTypes)
  }, [ offer ])

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

  const renderDocuments = () => (
    <OrderDocumentsToSignList
      companyId={companyId}
      orderId={orderId as number}
      types={documentTypes || []}
      current={offer.documents || []}
      checkSignedFn={document => document.info?.clientSigned === true}
    />
  )

  const renderHasOfferContent = () => (
    <Div>
      <Row className="ClientOrderBankOfferInfo__section">
        <Col span={24} xl={12}>
          <OrderConditionView condition={offer.conditions}/>
        </Col>
      </Row>
      <Div className="ClientOrderBankOfferInfo__section">
        <Title level={5}>{t('orderStepBankOffer.sections.documentsForSign.title')}</Title>
        {renderDocuments()}
      </Div>
      <Div className="ClientOrderBankOfferInfo__section">
        {bankOfferStatus === BankOfferStatus.BankOfferSent && <>
          <Paragraph>{t('orderStepBankOffer.sections.confirmation.part1')}</Paragraph>
          <Paragraph>{t('orderStepBankOffer.sections.confirmation.part2')}</Paragraph>
        </>}
        {bankOfferStatus === BankOfferStatus.Completed && <>
          <Paragraph>{t('orderStepBankOffer.sections.completed')}</Paragraph>
          <Paragraph>
            {t('orderStepBankOffer.sections.readyForFactoring')}
            <Button style={{ marginLeft: '24px' }}
                    type="primary"
                    onClick={() => history.push(
                      `/factoring?${FACTORING_ORDER_ID_PARAM}=${orderId}&${OFFER_BANK_ID_PARAM}=${offer.bank.id}`,
                    )}
            >
              {t('orderStepBankOffer.sections.createFactoring')}
            </Button>
          </Paragraph>
        </>}
      </Div>
    </Div>
  )

  const renderWaitMessage = () => {
    const isOfferOnBankSide = bankOfferStatus !== BankOfferStatus.CustomerSign
    return (
      <Result
        icon={<ClockCircleFilled/>}
        title={t(`orderStepBankOffer.statuses.${isOfferOnBankSide ? 'waitingForBank' : 'waitingForCustomer'}.title`)}
        subTitle={isOfferOnBankSide ? t('orderStepBankOffer.statuses.waitingForBank.desc') : null}
      />
    )
  }

  const renderOfferContent = () => {
    if (!bankOfferStatus) {
      return <Skeleton active/>
    }
    if (bankOfferStatus === BankOfferStatus.BankSign
        || bankOfferStatus === BankOfferStatus.BankVerify
        || bankOfferStatus === BankOfferStatus.BankWaitForVerify
        || bankOfferStatus === BankOfferStatus.BankViewed) {
      return renderWaitMessage()
    }
    return (
      <>
        {bankOfferStatus === BankOfferStatus.CustomerSign && renderWaitMessage()}
        {renderHasOfferContent()}
      </>
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
    return <Skeleton/>
  }

  return (
    <Div className="ClientOrderBankOfferInfo">
      <Div className="ClientOrderBankOfferInfo__navigateBack">
        <Button
          icon={<ArrowLeftOutlined/>}
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
      {bankOfferStatus === BankOfferStatus.BankOfferSent && renderActions()}
    </Div>
  )
}

export default ClientOrderBankOfferInfo
