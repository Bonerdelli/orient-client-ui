import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './FrameBankWizard.style.less'

const { Paragraph } = Typography

export interface FrameBankWizardProps {

}

const FrameBankWizard: React.FC<FrameBankWizardProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="FrameBankWizard" data-testid="FrameBankWizard">
      <Paragraph>{t('FrameBankWizard.component')}</Paragraph>
    </div>
  )
}

export default FrameBankWizard
