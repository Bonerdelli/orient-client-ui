import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'components/Div'
import DocumentsList from 'components/DocumentsList'

import './FrameDocuments.style.less'

const { Title, Paragraph } = Typography

export interface FrameDocumentsProps {
  orderId: number
  customerId: number
}

const PRIMARY_DOC_TYPES = [6, 7] // TODO: FIXME look in db, there is no augmentable types
const SECONDARY_DOC_TYPES = [8] // TODO: FIXME look in db, there is no augmentable types

const FrameDocuments: React.FC<FrameDocumentsProps> = ({ orderId, customerId }) => {
  const { t } = useTranslation()
  return (
    <Div className="FrameDocuments">
      <Paragraph>{t('frameSteps.documents.title')}</Paragraph>
      <Title level={5}>{t('frameSteps.documents.sectionTitles.mainDocs')}</Title>
      <DocumentsList customerId={customerId} orderId={orderId} types={PRIMARY_DOC_TYPES} />
      <Title level={5}>{t('frameSteps.documents.sectionTitles.additionalDocs')}</Title>
      <DocumentsList customerId={customerId} orderId={orderId} types={SECONDARY_DOC_TYPES} />
      <Title level={5}>{t('frameSteps.documents.sectionTitles.сompanyData')}</Title>
    </Div>
  )
}

export default FrameDocuments
