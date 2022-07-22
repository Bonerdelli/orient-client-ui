import { Layout } from 'antd'
import { useHistory } from 'react-router-dom'

import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import themeConfig from 'config/theme.yaml'

import ClientAppHeader from 'components/ClientAppHeader'
import CustomerAppHeader from 'components/CustomerAppHeader'
import SideMenu from 'components/SideMenu'

import { ClientRoutes, CustomerRoutes } from 'library/routes'
import { useStoreState, useStoreActions } from 'library/store'
import { isCustomer, isClient } from 'library/helpers/user'

const { Sider, Content } = Layout

const AppLayoutProtected = () => {
  const user = useStoreState(state => state.user.current)
  const companyId = useStoreState(state => state.company.companyId)
  const { setLogout } = useStoreActions(actions => actions.user)
  const history = useHistory()

  const handleLogout = () => {
    setLogout()
    history.push('/')
  }

  if ((!isCustomer(user) && !isClient(user)) || !companyId) {
    return (
      <ErrorResultView
        centered
        status="warning"
        title="common.errors.accessDenied.title"
        message="common.errors.accessDenied.desc"
        actionTitle="common.user.actions.logout.title"
        actionCallback={handleLogout}
      />
    )
  }

  return (
    <Layout className="AppLayout AppLayout--protected">
      {isCustomer(user) ? <CustomerAppHeader /> : <ClientAppHeader />}
      <Layout>
        <Sider
          theme="light"
          collapsible
          breakpoint="lg"
          className="AppLayout__leftMenu"
          width={themeConfig['side-navigation-width']}
          collapsedWidth={themeConfig['side-navigation-collapsed-width']}
        >
          <SideMenu />
        </Sider>
        <Content className="AppLayout__content">
          {isCustomer(user) ? <CustomerRoutes /> : <ClientRoutes />}
        </Content>
      </Layout>
    </Layout>
  )
}
export default AppLayoutProtected
