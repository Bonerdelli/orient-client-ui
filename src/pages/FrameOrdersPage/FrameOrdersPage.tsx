// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout } from 'antd'

import FrameOrdersList from 'components/__operator/FrameOrdersList'
import FrameOperatorWizard from 'components/__operator/FrameOperatorWizard'

import './FrameOrdersPage.style.less'

const FrameOrdersPage = () => {

  const { path, url } = useRouteMatch()

  const renderList = (): JSX.Element => (
    <Space direction="vertical" size="middle">
      <FrameOrdersList />
    </Space>
  )

  return (
    <Layout className="FrameOrdersPage" data-testid="FrameOrdersPage">
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>
        <Route path={`${path}/:itemId`}>
          <FrameOperatorWizard backUrl={url} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default FrameOrdersPage
