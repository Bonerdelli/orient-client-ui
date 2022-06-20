import { useTranslation } from 'react-i18next'
// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout, Spin } from 'antd'

import { useStoreState } from 'library/store'

import Div from 'components/Div' // TODO: from ui-lib

import OrdersList from 'components/OrdersList'
import FrameWizard from 'components/FrameWizard'

import './OrdersPage.style.less'

const OrdersPage = () => {
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
      <OrdersList companyId={company.id as number} />
    </Space>
  )

  return (
    <Layout className="OrdersPage" data-testid="OrdersPage">
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>
        <Route path={`${path}/:itemId`}>
          <FrameWizard backUrl={url} companyId={company.id as number} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default OrdersPage
