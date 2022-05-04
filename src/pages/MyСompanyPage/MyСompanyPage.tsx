import { useTranslation } from 'react-i18next'
import { Tabs } from 'antd'

import CompanyForm from 'components/CompanyForm'
import CompanyContactsForm from 'components/CompanyContactsForm'

import './MyСompanyPage.style.less'

const { TabPane } = Tabs

const MyСompanyPage = () => {
  const { t } = useTranslation()
  return (
    <div className="MyСompanyPage" data-testid="MyСompanyPage">
      <Tabs className="MyСompanyPage__tabNavigation">
        <TabPane tab={t('сompanyPage.tabs.mainInfo.title')} key="main-info">
          <CompanyForm />
        </TabPane>
        <TabPane tab={t('сompanyPage.tabs.contacts.title')} key="contacts">
          <CompanyContactsForm />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default MyСompanyPage
