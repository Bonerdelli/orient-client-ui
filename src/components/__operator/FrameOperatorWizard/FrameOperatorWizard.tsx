import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './FrameOperatorWizard.style.less'

const { Paragraph } = Typography

export interface FrameOperatorWizardProps {

}

const FrameOperatorWizard: React.FC<FrameOperatorWizardProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="FrameOperatorWizard" data-testid="FrameOperatorWizard">
      <Paragraph>{t('FrameOperatorWizard.component')}</Paragraph>
    </div>
  )
}

export default FrameOperatorWizard
