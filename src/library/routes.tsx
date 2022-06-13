import { Switch, Route, Redirect, RouteProps } from 'react-router-dom'
import portalConfig from 'config/portal.yaml'

import { Roles, hasAccess } from 'orient-ui-library'

import LoginPage from 'pages/LoginPage'
import PageNotFound from 'pages/PageNotFound'
import MyCompanyPage from 'pages/MyCompanyPage'
import CompanyHeadsPage from 'pages/CompanyHeadsPage'
import BankRequisitesPage from 'pages/BankRequisitesPage'
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
      <LoginPage />
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
      path={portalConfig.sections.company}
      component={MyCompanyPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      path={portalConfig.sections.heads}
      component={CompanyHeadsPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      path={portalConfig.sections.bankDetails}
      component={BankRequisitesPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      path={portalConfig.sections.documents}
      component={DocumentsPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      path={portalConfig.sections.requests}
      component={RequestsPage}
      roles={portalConfig.roles.pages.all}
    />
    <Route exact path="/">
      <Redirect to={{ pathname: '/my-company' }} />
    </Route>
    <Route exact path="/login">
      <Redirect to={{ pathname: '/my-company' }} />
    </Route>
    <Route path="*">
      <PageNotFound />
    </Route>
  </Switch>
)
