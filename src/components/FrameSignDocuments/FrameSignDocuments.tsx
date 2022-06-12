import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import Div from 'components/Div'

import './FrameSignDocuments.style.less'

const { Title } = Typography

export interface FrameSignDocumentsProps {

}

const FrameSignDocuments: React.FC<FrameSignDocumentsProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <Div className="FrameSignDocuments">
      <Title level={5}>{t('frameSteps.signDocuments.sectionTitles.signDocuments')}</Title>
    </Div>
  )
}

export default FrameSignDocuments
