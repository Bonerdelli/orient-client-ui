// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout } from 'antd'

import FrameOrdersList from 'components/FrameOrdersList'
import FrameBankWizard from 'components/FrameBankWizard'
import { MOCK_BANK_ID } from 'library/mock/bank'

import './FrameOrdersPage.style.less'

const FrameOrdersPage = () => {

  const { path, url } = useRouteMatch()

  const renderList = (): JSX.Element => (
    <Space direction="vertical" size="middle">
      <FrameOrdersList bankId={MOCK_BANK_ID} />
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
