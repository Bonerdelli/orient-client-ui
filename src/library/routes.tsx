import { FC } from 'react'
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import portalConfig from 'config/portal.yaml'

import HomePage from 'pages/HomePage'
import Login from 'pages/Login'

import { hasAccess } from './helpers/roles'

import { Roles } from 'library/models'

interface PrivateRouteOptions extends RouteProps {
  component: FC<RouteProps>
  roles: Roles
}

const PrivateRoute: FC<PrivateRouteOptions> = ({
  component: Component,
  roles: accessRoles,
  ...rest
}) => {
  const { keycloak } = useKeycloak()
  const roles: Roles = keycloak.tokenParsed?.realm_access?.roles

  return (
    <Route
      {...rest}
      render={(props) =>
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
      <Login />
    </Route>
    <Route path="*">
      <Redirect to={{ pathname: '/login' }} />
    </Route>
  </Switch>
)

// TODO: make lazy loading works
export const ProtectedRoutes = () => (
  <Switch>
    <PrivateRoute
      exact
      path="/"
      component={HomePage}
      roles={portalConfig.roles.pages.operationalManage}
    />
    <Route exact path="/login">
      <Redirect to={{ pathname: '/' }} />
    </Route>
    <Route path="*">
      {/* TODO: <PageNotFound /> */}
    </Route>
  </Switch>
)
