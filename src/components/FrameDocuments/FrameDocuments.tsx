import { useTranslation } from 'react-i18next'
import { Typography, Timeline } from 'antd'

import Div from 'components/Div'
import DocumentsList from 'components/DocumentsList'

import { CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons'

import './FrameDocuments.style.less'

const { Title } = Typography
const { Item: TimelineItem } = Timeline

export interface FrameDocumentsProps {
  orderId: number
  customerId: number
}

const PRIMARY_DOC_TYPES = [6, 7] // TODO: FIXME look in db, there is no augmentable types
const SECONDARY_DOC_TYPES = [8] // TODO: FIXME look in db, there is no augmentable types

const FrameDocuments: React.FC<FrameDocumentsProps> = ({ orderId, customerId }) => {
  const { t } = useTranslation()
  const сompanyDataReady = {
    сompanyHead: true,
    bankRequisites: true,
    questionnaire: false,
  }
  const dotParams = (ready: boolean) => ({
    dot: ready ? <CheckCircleFilled size={16} /> : <ExclamationCircleOutlined />,
    color: ready ? 'green' : 'red',
  })
  return (
    <Div className="FrameDocuments">
      <Div className="FrameDocuments__title">
        <Title level={4}>{t('frameSteps.documents.title')}</Title>
      </Div>
      <Div className="FrameDocuments__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.mainDocs')}</Title>
        <DocumentsList customerId={customerId} orderId={orderId} types={PRIMARY_DOC_TYPES} />
      </Div>
      <Div className="FrameDocuments__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.additionalDocs')}</Title>
        <DocumentsList customerId={customerId} orderId={orderId} types={SECONDARY_DOC_TYPES} />
      </Div>
      <Div className="FrameDocuments__section">
        <Title level={5}>{t('frameSteps.documents.sectionTitles.сompanyData')}</Title>
        <Timeline className="FrameDocuments__companyDataStatus">
          <TimelineItem {...dotParams(сompanyDataReady.сompanyHead)}>
            {t('frameSteps.documents.сompanyData.сompanyHead')}
          </TimelineItem>
          <TimelineItem {...dotParams(сompanyDataReady.bankRequisites)}>
            {t('frameSteps.documents.сompanyData.bankRequisites')}
          </TimelineItem>
          <TimelineItem {...dotParams(сompanyDataReady.questionnaire)}>
            {t('frameSteps.documents.сompanyData.questionnaire')}
          </TimelineItem>
        </Timeline>
      </Div>
    </Div>
  )
}

export default FrameDocuments
