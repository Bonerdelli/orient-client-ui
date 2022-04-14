import { Layout } from 'antd'

import { PublicRoutes } from 'library/routes'

const { Content } = Layout

const AppLayoutPublic = () => (
  <Layout className="AppLayout AppLayout--public">
    <Content>
      <PublicRoutes />
    </Content>
  </Layout>
)

export default AppLayoutPublic
