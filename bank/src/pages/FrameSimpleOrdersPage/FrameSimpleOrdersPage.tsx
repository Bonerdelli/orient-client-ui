// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout } from 'antd'

import FrameSimpleOrdersList from 'components/FrameSimpleOrdersList'
import FrameBankWizard from 'components/FrameBankWizard' // TODO: add wizard
import { MOCK_BANK_ID } from 'library/mock/bank'

import './FrameOrdersPage.style.less'

const FrameOrdersPage = () => {

  const { path, url } = useRouteMatch()

  const renderList = (): JSX.Element => (
    <Space direction="vertical" size="middle">
      <FrameSimpleOrdersList bankId={MOCK_BANK_ID} />
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
