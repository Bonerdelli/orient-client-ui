import { useTranslation } from 'react-i18next'
import { Typography, Layout } from 'antd'

import './RequestsPage.style.less'

const { Paragraph } = Typography

const RequestsPage = () => {
  const { t } = useTranslation()
  return (
    <Layout className="RequestsPage" data-testid="RequestsPage">
      <Paragraph>{t('RequestsPage.component')}</Paragraph>
    </Layout>
  )
}

export default RequestsPage
