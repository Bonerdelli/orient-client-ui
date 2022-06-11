import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './FrameWizard.style.less'

const { Paragraph } = Typography

export interface FrameWizardProps {

}

const FrameWizard: React.FC<FrameWizardProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="FrameWizard" data-testid="FrameWizard">
      <Paragraph>{t('FrameWizard.component')}</Paragraph>
    </div>
  )
}

export default FrameWizard
