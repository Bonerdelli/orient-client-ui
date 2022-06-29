import { Redirect, Route, RouteProps, Switch } from 'react-router-dom'
import portalConfig from 'config/portal.yaml'

import { UserRoles } from 'orient-ui-library/library/models/user'
import { hasAccess } from 'orient-ui-library/library/helpers/roles'

import LoginPage from 'pages/LoginPage'
import PageNotFound from 'pages/PageNotFound'
import MyCompanyPage from 'pages/MyCompanyPage'
import CompanyHeadsPage from 'pages/CompanyHeadsPage'
import BankRequisitesPage from 'pages/BankRequisitesPage'
import DocumentsPage from 'pages/DocumentsPage'
import OrdersPage from 'pages/OrdersPage'

import FrameClientWizardPage from 'pages/FrameClientWizardPage'
import FrameSimpleClientWizardPage from 'pages/FrameSimpleClientWizardPage'
import FactoringClientWizardPage from 'pages/FactoringClientWizardPage'
import QuestionnairePage from 'pages/QuestionnairePage'

interface PrivateRouteOptions extends RouteProps {
  component: React.FC<RouteProps>;
  roles: UserRoles;
}

export const HOME_PATH = portalConfig.sections.company
export const LOGIN_PATH = '/login'
export const FRAME_ORDER_PATH = '/frame-order'
export const SIMPLE_FRAME_ORDER_PATH = '/frame-simple-order'
export const FACTORING_PATH = '/factoring'
export const QUESTIONNAIRE_PATH = '/questionnaire'

const PrivateRoute: React.FC<PrivateRouteOptions> = ({
  component: Component,
  roles: accessRoles,
  ...rest
}) => {
  const roles: any = [ 'admin' ] // TODO: use user.roles from API
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
      <LoginPage/>
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
      path={portalConfig.sections.questionnaire}
      component={QuestionnairePage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      path={portalConfig.sections.requests}
      component={OrdersPage}
      roles={portalConfig.roles.pages.all}
    />

    <PrivateRoute
      path={FRAME_ORDER_PATH}
      component={FrameClientWizardPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      path={SIMPLE_FRAME_ORDER_PATH}
      component={FrameSimpleClientWizardPage}
      roles={portalConfig.roles.pages.all}
    />
    <PrivateRoute
      path={FACTORING_PATH}
      component={FactoringClientWizardPage}
      roles={portalConfig.roles.pages.all}
    />

    <Route exact path="/">
      <Redirect to={{pathname: HOME_PATH}} />
    </Route>
    <Route exact path="/login">
      <Redirect to={{ pathname: HOME_PATH }} />
    </Route>
    <Route path="*">
      <PageNotFound/>
    </Route>
  </Switch>
)
