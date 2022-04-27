import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './RequestsPage.style.less'

const { Paragraph } = Typography

const RequestsPage = () => {
  const { t } = useTranslation()
  return (
    <div className="RequestsPage" data-testid="RequestsPage">
      <Paragraph>{t('RequestsPage.component')}</Paragraph>
    </div>
  )
}

export default RequestsPage
