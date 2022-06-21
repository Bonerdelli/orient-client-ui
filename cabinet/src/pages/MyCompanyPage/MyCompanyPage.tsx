import { useTranslation } from 'react-i18next'
import { Layout, Tabs, Spin } from 'antd'

import { useStoreState } from 'library/store'

import Div from 'orient-ui-library/components/Div'

import CompanyForm from 'components/CompanyForm'
import CompanyContactsForm from 'components/CompanyContactsForm'

import './MyCompanyPage.style.less'

const { TabPane } = Tabs

const MyCompanyPage = () => {
  const { t } = useTranslation()
  const company = useStoreState(state => state.company.current)

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <Layout className="MyCompanyPage" data-testid="MyCompanyPage">
      <Tabs className="MyCompanyPage__tabNavigation">
        <TabPane tab={t('companyPage.tabs.mainInfo.title')} key="main-info">
          <CompanyForm company={company} />
        </TabPane>
        <TabPane tab={t('companyPage.tabs.contacts.title')} key="contacts">
          <CompanyContactsForm companyId={company.id as number} />
        </TabPane>
      </Tabs>
    </Layout>
  )
}

export default MyCompanyPage
