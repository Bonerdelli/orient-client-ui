import { useTranslation } from 'react-i18next'
import { Layout, Typography } from 'antd'

import './DocumentsPage.style.less'

const { Paragraph } = Typography

const DocumentsPage = () => {
  const { t } = useTranslation()
  return (
    <Layout className="DocumentsPage" data-testid="DocumentsPage">
      <Paragraph>{t('DocumentsPage.component')}</Paragraph>
    </Layout>
  )
}

export default DocumentsPage
