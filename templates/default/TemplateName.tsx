import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './TemplateName.style.less'

const { Paragraph } = Typography

const TemplateName = () => {
  const { t } = useTranslation()
  return (
    <div className="TemplateName" data-testid="TemplateName">
      <Paragraph>{t('TemplateName.component')}</Paragraph>
    </div>
  )
}

export default TemplateName
