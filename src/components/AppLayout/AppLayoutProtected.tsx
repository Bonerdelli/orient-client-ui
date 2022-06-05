import { Layout } from 'antd'

import themeConfig from 'orient-ui-library/config/theme.yaml'

import AppHeader from 'components/AppHeader'
import SideMenu from 'components/SideMenu'

import { ProtectedRoutes } from 'library/routes'

const { Sider, Content } = Layout

const AppLayoutProtected = () => (
  <Layout className="AppLayout AppLayout--protected">
    <AppHeader />
    <Layout>
      <Sider
        theme="light"
        collapsible
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

export default AppLayoutProtected
