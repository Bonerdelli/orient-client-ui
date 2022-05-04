import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './TemplateName.style.less'

const { Paragraph } = Typography

export interface TemplateNameProps {

}

const TemplateName: React.FC<TemplateNameProps> = ({}) => {
  const { t } = useTranslation()
  return (
    <div className="TemplateName" data-testid="TemplateName">
      <Paragraph>{t('TemplateName.component')}</Paragraph>
    </div>
  )
}

export default TemplateName
