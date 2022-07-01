// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout } from 'antd'

import FactoringOrdersList from 'components/FactoringOrdersList'
import FactoringOperatorWizard from 'components/FactoringOperatorWizard' // TODO: FactoringOperatorWizard

import './FactoringOrdersPage.style.less'

const FactoringOrdersPage = () => {

  const { path, url } = useRouteMatch()

  const renderList = (): JSX.Element => (
    <Space direction="vertical" size="middle">
      <FactoringOrdersList />
    </Space>
  )

  return (
    <Layout className="FactoringOrdersPage" data-testid="FactoringOrdersPage">
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>
        <Route path={`${path}/:itemId`}>
          <FactoringOperatorWizard backUrl={url} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default FactoringOrdersPage
