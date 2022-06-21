import { Layout } from 'antd'

import themeConfig from 'config/theme.yaml'

import BankAppHeader from 'components/BankAppHeader'
import SideMenu from 'components/SideMenu'

import { ProtectedRoutes } from 'library/routes'

const { Sider, Content } = Layout

const AppLayoutProtected = () => (
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

export default AppLayoutProtected
