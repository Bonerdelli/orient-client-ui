// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout } from 'antd'

import FrameOrdersList from 'components/__bank/FrameOrdersList'
import FrameBankWizard from 'components/__bank/FrameBankWizard'

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
          <FrameBankWizard backUrl={url} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default FrameOrdersPage
