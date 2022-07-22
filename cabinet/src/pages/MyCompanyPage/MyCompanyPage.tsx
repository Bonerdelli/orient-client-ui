import { useTranslation } from 'react-i18next'
import { Layout, message, Spin, Tabs } from 'antd'

import { useStoreState } from 'library/store'

import Div from 'orient-ui-library/components/Div'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import { ApiSuccessResponse } from 'orient-ui-library/library/helpers/api'
import { CompanyDto, CompanyFounderDto } from 'orient-ui-library/library/models/proxy'

import CompanyForm from 'components/CompanyForm'
import CompanyContactsForm from 'components/CompanyContactsForm'

import './MyCompanyPage.style.less'
import { useEffect, useState } from 'react'
import { getCompanyHeads } from 'library/api'
import { getCompany } from 'library/api'

const { TabPane } = Tabs

const MyCompanyPage = () => {
  const { t } = useTranslation()
  const companyId = useStoreState(state => state.company.companyId)

  const [ company, setCompany ] = useState<CompanyDto>()
  const [ companyHead, setCompanyHead ] = useState<CompanyFounderDto>()
  const [ companyLoaded, setCompanyLoaded ] = useState<boolean>()

  const getCurrentCompany = async () => {
    const result = await getCompany()
    if (result.success && (result as ApiSuccessResponse<CompanyDto[]>).data?.length) {
      setCompany(result.data?.[0] as CompanyDto)
      setCompanyLoaded(true)
    } else {
      setCompanyLoaded(false)
    }
  }

  useEffect(() => {
    getCurrentCompany()
  }, [ companyId ])

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

  if (companyLoaded === false) {
    return (
      <ErrorResultView centered status="error"/>
    )
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
