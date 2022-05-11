import { useTranslation } from 'react-i18next'
import { Layout, Typography } from 'antd'

import CompanyHeadsList from 'components/CompanyHeadsList'

import './CompanyHeadsPage.style.less'

const { Title } = Typography

const CompanyHeadsPage = () => {
  const { t } = useTranslation()
  return (
    <Layout className="CompanyHeadsPage" data-testid="CompanyHeadsPage">
      <Title level={3}>{t('sections.heads.title')}</Title>
      <CompanyHeadsList />
    </Layout>
  )
}

export default CompanyHeadsPage
