import { useTranslation } from 'react-i18next'
import { Space, Layout, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useStoreState } from 'library/store'

import CompanyHeadsList from 'components/CompanyHeadsList'
import CompanyHeadForm from 'components/CompanyHeadForm'

import './CompanyHeadsPage.style.less'

const CompanyHeadsPage = () => {
  const { t } = useTranslation()
  const company = useStoreState(state => state.company.current)
  return (
    <Layout className="CompanyHeadsPage" data-testid="CompanyHeadsPage">
      <Space direction="vertical" size="middle">
        <CompanyHeadsList />
        <Button icon={<PlusOutlined />} type="default" size="large">{t('common.actions.add.title')}</Button>
        {company && <CompanyHeadForm companyId={company?.id as number} />}
      </Space>
    </Layout>
  )
}

export default CompanyHeadsPage
