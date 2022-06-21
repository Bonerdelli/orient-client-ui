import { useState } from 'react'
import { useTranslation } from 'react-i18next'
// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import { Space, Layout, Spin, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useStoreState } from 'library/store'

import CompanyHeadsList from 'components/CompanyHeadsList'
import CompanyHeadForm from 'components/CompanyHeadForm'
import Div from 'orient-ui-library/components/Div'

import './CompanyHeadsPage.style.less'


const CompanyHeadsPage = () => {
  const { t } = useTranslation()
  const { path, url } = useRouteMatch()

  const company = useStoreState(state => state.company.current)

  if (!company) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  const renderList = (): JSX.Element => (
    <Space direction="vertical" size="middle">
      <CompanyHeadsList companyId={company.id as number} />
      <Link to={`${url}/add`}>
        <Button icon={<PlusOutlined />} type="link" size="large">{t('common.actions.add.title')}</Button>
      </Link>
    </Space>
  )

  return (
    <Layout className="CompanyHeadsPage" data-testid="CompanyHeadsPage">
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>
        <Route path={`${path}/:itemId`}>
          <CompanyHeadForm backUrl={url} companyId={company.id as number} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default CompanyHeadsPage
