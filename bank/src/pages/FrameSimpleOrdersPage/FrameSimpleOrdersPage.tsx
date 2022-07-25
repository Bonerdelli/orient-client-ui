// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout } from 'antd'

import FrameSimpleOrdersList from 'components/FrameSimpleOrdersList'
import FrameSimpleBankWizard from 'components/FrameSimpleBankWizard'
import { useStoreState } from 'library/store'

import './FrameSimpleOrdersPage.style.less'

const FrameSimpleOrdersPage = () => {

  const { path, url } = useRouteMatch()
  const bankId = useStoreState(state => state.bank.bankId)

  const renderList = (): JSX.Element => (
    <Space direction="vertical" size="middle">
      <FrameSimpleOrdersList bankId={bankId as number} />
    </Space>
  )

  return (
    <Layout className="FrameSimpleOrdersPage" data-testid="FrameSimpleOrdersPage">
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>
        <Route path={`${path}/:itemId`}>
          <FrameSimpleBankWizard backUrl={url} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default FrameSimpleOrdersPage
