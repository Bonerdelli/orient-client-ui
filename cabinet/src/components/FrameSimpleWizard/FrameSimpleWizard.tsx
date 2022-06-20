import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './FrameSimpleWizard.style.less'

const { Paragraph } = Typography

export interface FrameSimpleWizardProps {

}

const FrameSimpleWizard: React.FC<FrameSimpleWizardProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="FrameSimpleWizard" data-testid="FrameSimpleWizard">
      <Paragraph>{t('FrameSimpleWizard.component')}</Paragraph>
    </div>
  )
}

export default FrameSimpleWizard
