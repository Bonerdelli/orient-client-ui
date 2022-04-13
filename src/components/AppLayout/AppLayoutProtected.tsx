import { ProtectedRoutes } from 'library/routes'

import AppHeader from 'components/AppHeader'

import './AppLayout.style.less'

const AppLayoutProtected = () => (
  <div className="AppLayout__protected">
    <AppHeader />
    <div className="AppLayout__protected__content">
      <ProtectedRoutes />
    </div>
  </div>
)

export default AppLayoutProtected
