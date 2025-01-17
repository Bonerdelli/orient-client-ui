import { Switch, Route, Redirect, RouteProps } from 'react-router-dom'
import portalConfig from 'config/portal.yaml'

import { UserRoles } from 'orient-ui-library/library/models/user'
import { hasAccess } from 'orient-ui-library/library/helpers/roles'

import LoginPage from 'pages/LoginPage'
import PageNotFound from 'pages/PageNotFound'
import FrameOrdersPage from 'pages/FrameOrdersPage'
import FrameSimpleOrdersPage from 'pages/FrameSimpleOrdersPage'
import FactoringOrdersPage from 'pages/FactoringOrdersPage'

interface PrivateRouteOptions extends RouteProps {
  component: React.FC<RouteProps>
  roles: UserRoles
}

export const HOME_PATH = portalConfig.sections.frameOrders
export const LOGIN_PATH = '/login'

const PrivateRoute: React.FC<PrivateRouteOptions> = ({
  component: Component,
  roles: accessRoles,
  ...rest
}) => {
  const roles: any = ['admin'] // TODO: use user.roles from API
  return (
    <Route
      {...rest}
      render={props =>
        hasAccess(roles, accessRoles) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/' }} />
        )
      }
    />
  )
}

export const PublicRoutes = () => (
  <Switch>
    <Route exact path="/login">
      <LoginPage />
    </Route>
    <Route path="*">
      <Redirect to={{ pathname: LOGIN_PATH }} />
    </Route>
  </Switch>
)

// TODO: make lazy loading works?
export const ProtectedRoutes = () => (
  <Switch>

    <PrivateRoute
      path="/frame-orders"
      component={FrameOrdersPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      path="/frame-simple-orders"
      component={FrameSimpleOrdersPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      path="/factoring-orders"
      component={FactoringOrdersPage}
      roles={portalConfig.roles.pages.all}
    />

    <Route exact path="/">
      <Redirect to={{ pathname: HOME_PATH }} />
    </Route>
    <Route exact path="/login">
      <Redirect to={{ pathname: HOME_PATH }} />
    </Route>
    <Route path="*">
      <PageNotFound />
    </Route>
  </Switch>
)
