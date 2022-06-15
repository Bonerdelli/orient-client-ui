import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './FrameOrdersPage.style.less'

const { Paragraph } = Typography

export interface FrameOrdersPageProps {

}

const FrameOrdersPage: React.FC<FrameOrdersPageProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="FrameOrdersPage" data-testid="FrameOrdersPage">
      <Paragraph>{t('FrameOrdersPage.component')}</Paragraph>
    </div>
  )
}

export default FrameOrdersPage
