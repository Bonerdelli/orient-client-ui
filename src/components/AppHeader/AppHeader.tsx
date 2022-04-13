import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './AppHeader.style.less'

const { Paragraph } = Typography

const AppHeader = () => {
  const { t } = useTranslation()
  return (
    <div className="AppHeader" data-testid="AppHeader">
      <Paragraph>{t('AppHeader.component')}</Paragraph>
    </div>
  )
}

export default AppHeader
