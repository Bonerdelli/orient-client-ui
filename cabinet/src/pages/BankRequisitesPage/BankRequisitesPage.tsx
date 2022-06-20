import { useTranslation } from 'react-i18next'
// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import { Space, Layout, Spin, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useStoreState } from 'library/store'

import Div from 'components/Div' // TODO: from ui-lib

import BankRequisitesList from 'components/BankRequisitesList'
import { BankRequisitesAddForm, BankRequisitesEditForm } from 'components/BankRequisitesForm'

import './BankRequisitesPage.style.less'


const BankRequisitesPage = () => {
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
      <BankRequisitesList companyId={company.id as number} />
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
          <BankRequisitesAddForm backUrl={url} companyId={company.id as number} />
        </Route>
        <Route path={`${path}/:itemId`}>
          <BankRequisitesEditForm backUrl={url} companyId={company.id as number} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default BankRequisitesPage