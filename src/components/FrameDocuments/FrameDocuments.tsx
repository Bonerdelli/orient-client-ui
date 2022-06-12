import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'components/Div'

import './FrameDocuments.style.less'

const { Title } = Typography

export interface FrameDocumentsProps {

}

const FrameDocuments: React.FC<FrameDocumentsProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <Div className="FrameDocuments">
      <Title level={5}>{t('frameSteps.documents.title')}</Title>
    </Div>
  )
}

export default FrameDocuments
