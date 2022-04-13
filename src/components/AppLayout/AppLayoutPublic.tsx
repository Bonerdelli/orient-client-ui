import { PublicRoutes } from 'library/routes'

import './AppLayout.style.less'

const AppLayoutPublic = () => (
  <div className="AppLayout__public">
    <div className="AppLayout__public__content">
      <PublicRoutes />
    </div>
  </div>
)

export default AppLayoutPublic
