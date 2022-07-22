import { useTranslation } from 'react-i18next'
// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import { Space, Layout, Spin, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useStoreState } from 'library/store'

import Div from 'orient-ui-library/components/Div'

import BankRequisitesList from 'components/BankRequisitesList'
import { BankRequisitesAddForm, BankRequisitesEditForm } from 'components/BankRequisitesForm'

import './BankRequisitesPage.style.less'


const BankRequisitesPage = () => {
  const { t } = useTranslation()
  const { path, url } = useRouteMatch()

  const companyId = useStoreState(state => state.company.companyId)

  if (!companyId) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  const renderList = (): JSX.Element => (
    <Space direction="vertical" size="middle">
      <BankRequisitesList companyId={companyId} />
      <Link to={`${url}/add`}>
        <Button icon={<PlusOutlined />} type="link" size="large">{t('common.actions.add.title')}</Button>
      </Link>
    </Space>
  )

  return (
    <Layout className="BankRequisitesPage" data-testid="BankRequisitesPage">
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>
        <Route path={`${path}/add`}>
          <BankRequisitesAddForm backUrl={url} companyId={companyId} />
        </Route>
        <Route path={`${path}/:itemId`}>
          <BankRequisitesEditForm backUrl={url} companyId={companyId} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default BankRequisitesPage
