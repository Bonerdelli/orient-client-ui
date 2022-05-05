import { useTranslation } from 'react-i18next'
import { Layout, Tabs } from 'antd'

import CompanyForm from 'components/CompanyForm'
import CompanyContactsForm from 'components/CompanyContactsForm'

import './MyCompanyPage.style.less'

const { TabPane } = Tabs

const MyCompanyPage = () => {
  const { t } = useTranslation()
  return (
    <Layout className="MyCompanyPage" data-testid="MyCompanyPage">
      <Tabs className="MyCompanyPage__tabNavigation">
        <TabPane tab={t('сompanyPage.tabs.mainInfo.title')} key="main-info">
          <CompanyForm />
        </TabPane>
        <TabPane tab={t('сompanyPage.tabs.contacts.title')} key="contacts">
          <CompanyContactsForm />
        </TabPane>
      </Tabs>
    </Layout>
  )
}

export default MyCompanyPage
