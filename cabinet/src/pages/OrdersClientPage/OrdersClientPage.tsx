// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout, Spin } from 'antd'

import { useStoreState } from 'library/store'

import Div from 'orient-ui-library/components/Div'

import OrdersList from 'components/OrdersList'
import FrameClientWizard from 'components/FrameClientWizard'
import FrameSimpleClientWizard from 'components/FrameSimpleClientWizard'
import FactoringClientWizard from 'components/FactoringClientWizard'

import './OrdersClientPage.style.less'

const OrdersClientPage = () => {
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
    <Layout className="OrdersClientPage" data-testid="OrdersClientPage">
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>
        <Route path={`${path}/frame/:itemId`}>
          <FrameClientWizard backUrl={url} companyId={company.id as number} />
        </Route>
        <Route path={`${path}/frame-simple/:itemId`}>
          <FrameSimpleClientWizard backUrl={url} companyId={company.id as number} />
        </Route>
        <Route path={`${path}/factoring/:itemId`}>
          <FactoringClientWizard backUrl={url} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default OrdersClientPage
