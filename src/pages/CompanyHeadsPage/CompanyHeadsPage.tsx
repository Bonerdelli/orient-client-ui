import { useTranslation } from 'react-i18next'
import { Space, Layout, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import CompanyHeadsList from 'components/CompanyHeadsList'

import './CompanyHeadsPage.style.less'

const CompanyHeadsPage = () => {
  const { t } = useTranslation()
  return (
    <Layout className="CompanyHeadsPage" data-testid="CompanyHeadsPage">
      <Space direction="vertical" size="middle">
        <CompanyHeadsList />
        <Button icon={<PlusOutlined />} size="large">{t('common.actions.add.title')}</Button>
      </Space>
    </Layout>
  )
}

export default CompanyHeadsPage
