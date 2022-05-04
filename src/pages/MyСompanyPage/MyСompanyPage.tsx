import { useTranslation } from 'react-i18next'
import { Layout, Tabs } from 'antd'

import CompanyForm from 'components/CompanyForm'
import CompanyContactsForm from 'components/CompanyContactsForm'

import './MyСompanyPage.style.less'

const { TabPane } = Tabs

const MyСompanyPage = () => {
  const { t } = useTranslation()
  return (
    <Layout className="MyСompanyPage" data-testid="MyСompanyPage">
      <Tabs className="MyСompanyPage__tabNavigation">
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

export default MyСompanyPage
