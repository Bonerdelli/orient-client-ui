import { useTranslation } from 'react-i18next'
import { Layout, message, Spin, Tabs } from 'antd'

import { useStoreState } from 'library/store'

import Div from 'orient-ui-library/components/Div'
import { CompanyFounderDto } from 'orient-ui-library/library/models/proxy'

import CompanyForm from 'components/CompanyForm'
import CompanyContactsForm from 'components/CompanyContactsForm'

import './MyCompanyPage.style.less'
import { useEffect, useState } from 'react'
import { getCompanyHeads } from 'library/api'

const { TabPane } = Tabs

const MyCompanyPage = () => {
  const { t } = useTranslation()
  const company = useStoreState(state => state.company.current)

  const [ companyHead, setCompanyHead ] = useState<CompanyFounderDto>()

  useEffect(() => {
    if (company) {
      loadCompanyHeadData()
    }
  }, [ company ])

  const loadCompanyHeadData = async () => {
    const result = await getCompanyHeads({ companyId: company!.id! })
    if (result.success) {
      const io = (result.data as CompanyFounderDto[]).find(({ isIo }) => isIo)
      if (!io) {
        message.error('У компании отсутсвует учредитель')
      } else {
        setCompanyHead(io)
      }
    } else {
      message.error('Ошибка получения информации об учредителе компании')
    }
  }

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large"/>
      </Div>
    )
  }

  return (
    <Layout className="MyCompanyPage" data-testid="MyCompanyPage">
      <Tabs className="MyCompanyPage__tabNavigation">
        <TabPane tab={t('companyPage.tabs.mainInfo.title')} key="main-info">
          <CompanyForm company={company} companyHead={companyHead}/>
        </TabPane>
        <TabPane tab={t('companyPage.tabs.contacts.title')} key="contacts">
          <CompanyContactsForm companyId={company.id as number}/>
        </TabPane>
      </Tabs>
    </Layout>
  )
}

export default MyCompanyPage
