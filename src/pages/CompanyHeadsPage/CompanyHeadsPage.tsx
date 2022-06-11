import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Space, Layout, Spin, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useStoreState } from 'library/store'

import CompanyHeadsList from 'components/CompanyHeadsList'
import CompanyHeadForm from 'components/CompanyHeadForm'
import Div from 'components/Div' // TODO: from ui-lib

import './CompanyHeadsPage.style.less'

const CompanyHeadsPage = () => {
  const { t } = useTranslation()
  const [ companyAddShow, _setCompanyAddShow ] = useState<boolean>(false)
  const company = useStoreState(state => state.company.current)
  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }
  return (
    <Layout className="CompanyHeadsPage" data-testid="CompanyHeadsPage">
      <Space direction="vertical" size="middle">
        <CompanyHeadsList companyId={company.id as number} />
        <Button icon={<PlusOutlined />} type="link" size="large">{t('common.actions.add.title')}</Button>
        {company && companyAddShow && <CompanyHeadForm companyId={company.id as number} />}
      </Space>
    </Layout>
  )
}

export default CompanyHeadsPage
