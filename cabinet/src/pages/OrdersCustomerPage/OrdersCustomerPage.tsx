// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout, Spin } from 'antd'

import Div from 'orient-ui-library/components/Div'
import OrdersList from 'components/OrdersList'
import FrameCustomerWizard from 'components/FrameCustomerWizard'
import FrameSimpleCustomerWizard from 'components/FrameSimpleCustomerWizard'
import FactoringCustomerWizard from 'components/FactoringCustomerWizard'

import { useStoreState } from 'library/store'
import { CabinetMode } from 'library/models/cabinet'

import './OrdersCustomerPage.style.less'

const OrdersCustomerPage = () => {
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
      <OrdersList companyId={companyId} mode={CabinetMode.Customer} />
    </Space>
  )

  return (
    <Layout className="OrdersCustomerPage" data-testid="OrdersCustomerPage">
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>
        <Route path={`${path}/frame/:itemId`}>
          <FrameCustomerWizard backUrl={url} companyId={companyId} />
        </Route>
        <Route path={`${path}/frame-simple/:itemId`}>
          <FrameSimpleCustomerWizard backUrl={url} companyId={companyId} />
        </Route>
        <Route path={`${path}/factoring/:itemId`}>
          <FactoringCustomerWizard backUrl={url} companyId={companyId} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default OrdersCustomerPage
