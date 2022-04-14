import { Layout } from 'antd'

import AppHeader from 'components/AppHeader'
import SideMenu from 'components/SideMenu'

import { ProtectedRoutes } from 'library/routes'
import './AppLayout.style.less'

const { Sider, Content } = Layout

const AppLayoutProtected = () => (
  <Layout className="AppLayout__protected">
    <AppHeader />
    <Layout>
      <Content>
        <ProtectedRoutes />
      </Content>
      <Sider>
        <SideMenu />
      </Sider>
    </Layout>
  </Layout>
)

export default AppLayoutProtected
