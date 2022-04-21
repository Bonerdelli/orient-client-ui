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
        className="AppLayout__leftMenu"
        width={themeConfig['side-navigation-width']}
      >
        <SideMenu />
      </Sider>
      <Content>
        <ProtectedRoutes />
      </Content>
    </Layout>
  </Layout>
)

export default AppLayoutProtected
