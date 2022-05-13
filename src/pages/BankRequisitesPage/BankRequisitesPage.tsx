// import { useTranslation } from 'react-i18next'
import { Space, Layout } from 'antd'

import BankRequisitesList from 'components/BankRequisitesList'

import './BankRequisitesPage.style.less'

const BankRequisitesPage = () => {
  // const { t } = useTranslation()
  return (
    <Layout className="BankRequisitesPage" data-testid="BankRequisitesPage">
      <Space direction="vertical" size="middle">
        <BankRequisitesList />
      </Space>
    </Layout>
  )
}

export default BankRequisitesPage
