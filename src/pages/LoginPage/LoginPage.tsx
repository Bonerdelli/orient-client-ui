import { Row, Col } from 'antd'
// import { useTranslation } from 'react-i18next'
import { AuthResult } from 'orient-ui-library'
import LoginForm from 'ui-components/LoginForm' // TODO: move out to ui-lib

import { useStoreActions, useStoreState } from 'library/store'

import './LoginPage.style.less'

const LoginPage = () => {
  const { setUser } = useStoreActions(actions => actions.user)
  // const { t } = useTranslation()
  const handleLogin = (result: AuthResult) => {
    console.log('Success', result)
  }
  return (
    <Row justify="center" className="Login">
      <Col span={8}>
        <LoginForm onLogin={setUser} />
      </Col>
    </Row>
  )
}

export default LoginPage
