// import SlideRoutes from 'react-slide-routes' // TODO: make slide animation works
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { Space, Layout } from 'antd'

import FactoringOrdersList from 'components/FactoringOrdersList'
import FactoringBankWizard from 'components/FactoringBankWizard'
import { MOCK_BANK_ID } from 'library/mock/bank'

import './FactoringOrdersPage.style.less'

const FactoringOrdersPage = () => {

  const { path, url } = useRouteMatch()

  const renderList = (): JSX.Element => (
    <Space direction="vertical" size="middle">
      <FactoringOrdersList bankId={MOCK_BANK_ID} />
    </Space>
  )

  return (
    <Layout className="FactoringOrdersPage" data-testid="FactoringOrdersPage">
      <Switch>
        <Route exact path={path}>
          {renderList()}
        </Route>
        <Route path={`${path}/:itemId`}>
          <FactoringBankWizard backUrl={url} />
        </Route>
      </Switch>
    </Layout>
  )
}

export default FactoringOrdersPage
