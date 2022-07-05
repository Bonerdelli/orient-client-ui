import { Layout } from 'antd'
import { useHistory } from 'react-router-dom'

import { isBank } from 'orient-ui-library/library/helpers/roles'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'

import themeConfig from 'config/theme.yaml'

import BankAppHeader from 'components/BankAppHeader'
import SideMenu from 'components/SideMenu'

import { ProtectedRoutes } from 'library/routes'
import { useStoreState, useStoreActions } from 'library/store'

const { Sider, Content } = Layout

const AppLayoutProtected = () => {
  const user = useStoreState(state => state.user.current)
  const { setLogout } = useStoreActions(actions => actions.user)
  const history = useHistory()

  const handleLogout = () => {
    setLogout()
    history.push('/')
  }

  if (!isBank(user)) {
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
      <BankAppHeader />
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
          <ProtectedRoutes />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayoutProtected
