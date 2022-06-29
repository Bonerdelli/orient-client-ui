import { Layout } from 'antd'

import { isCustomer } from 'orient-ui-library/library/helpers/roles'

import themeConfig from 'config/theme.yaml'

import CompanyWrapper from 'components/CompanyWrapper'
import ClientAppHeader from 'components/ClientAppHeader'
import SideMenu from 'components/SideMenu'

import { ClientRoutes, CustomerRoutes } from 'library/routes'
import { useStoreState } from 'library/store'

const { Sider, Content } = Layout

const AppLayoutProtected = () => {
  const user = useStoreState(state => state.user.current)
  return (
    <Layout className="AppLayout AppLayout--protected">
      <ClientAppHeader />
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
          <CompanyWrapper>
            {isCustomer(user) ? <CustomerRoutes /> : <ClientRoutes />}
          </CompanyWrapper>
        </Content>
      </Layout>
    </Layout>
  )
}
export default AppLayoutProtected
