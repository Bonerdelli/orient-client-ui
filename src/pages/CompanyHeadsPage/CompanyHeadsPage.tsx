import { useTranslation } from 'react-i18next'
import { Layout, Typography } from 'antd'

import './CompanyHeadsPage.style.less'

const { Paragraph } = Typography

const CompanyHeadsPage = () => {
  const { t } = useTranslation()
  return (
    <Layout className="CompanyHeadsPage" data-testid="CompanyHeadsPage">
      <Paragraph>{t('CompanyHeadsPage.component')}</Paragraph>
    </Layout>
  )
}

export default CompanyHeadsPage
