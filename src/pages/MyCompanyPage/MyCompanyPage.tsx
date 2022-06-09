import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout, Tabs, Spin } from 'antd'

import { Company } from 'library/models/proxy' // TODO: to ui-lib
import { useApi } from 'library/helpers/api' // TODO: to ui-lib
import { getCompany } from 'library/api' // TODO: to ui-lib

import Div from 'ui-components/Div'
import ErrorResultView from 'ui-components/ErrorResultView'

import CompanyForm from 'components/CompanyForm'
import CompanyContactsForm from 'components/CompanyContactsForm'

import './MyCompanyPage.style.less'

const { TabPane } = Tabs

const MyCompanyPage = () => {
  const { t } = useTranslation()

  const [ company, setCompany ] = useState<Company>()
  const [ companies, companyLoaded ] = useApi<Company[]>(getCompany)


  useEffect(() => {
    if (companies?.length) {
      // NOTE: take first company because multiple companies not supported
      // TODO: ask be to make endpoint with default company
      setCompany(companies[0])
    }
  }, [companies])


  if (companyLoaded === false) {
    return (
      <ErrorResultView centered status="error" />
    )
  }

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
