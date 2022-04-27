import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './MyСompanyPage.style.less'

const { Paragraph } = Typography

const MyСompanyPage = () => {
  const { t } = useTranslation()
  return (
    <div className="MyСompanyPage" data-testid="MyСompanyPage">
      <Paragraph>{t('MyСompanyPage.component')}</Paragraph>
    </div>
  )
}

export default MyСompanyPage
