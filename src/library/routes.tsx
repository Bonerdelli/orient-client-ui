import { Switch, Route, Redirect, RouteProps } from 'react-router-dom'
import portalConfig from 'config/portal.yaml'

import { Roles, hasAccess } from 'orient-ui-library'

import Login from 'pages/Login'
import PageNotFound from 'pages/PageNotFound'
import MyСompanyPage from 'pages/MyСompanyPage'
import CompanyHeadsPage from 'pages/CompanyHeadsPage'
import BankDetailsPage from 'pages/BankDetailsPage'
import DocumentsPage from 'pages/DocumentsPage'
import RequestsPage from 'pages/RequestsPage'

interface PrivateRouteOptions extends RouteProps {
  component: React.FC<RouteProps>
  roles: Roles
}

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
      <Login />
    </Route>
    <Route path="*">
      <Redirect to={{ pathname: '/login' }} />
    </Route>
  </Switch>
)

// TODO: make lazy loading works?
export const ProtectedRoutes = () => (
  <Switch>
    <PrivateRoute
      exact
      path={portalConfig.sections.сompany}
      component={MyСompanyPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      exact
      path={portalConfig.sections.heads}
      component={CompanyHeadsPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      exact
      path={portalConfig.sections.bankDetails}
      component={BankDetailsPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      exact
      path={portalConfig.sections.documents}
      component={DocumentsPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      exact
      path={portalConfig.sections.requests}
      component={RequestsPage}
      roles={portalConfig.roles.pages.all}
    />
    <Route exact path="/">
      <Redirect to={{ pathname: '/my-сompany' }} />
    </Route>
    <Route exact path="/login">
      <Redirect to={{ pathname: '/my-сompany' }} />
    </Route>
    <Route path="*">
      <PageNotFound />
    </Route>
  </Switch>
)
