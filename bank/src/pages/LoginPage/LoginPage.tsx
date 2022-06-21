import { Row, Col } from 'antd'
import { useHistory } from 'react-router-dom'
import { AuthResult } from 'orient-ui-library'

import LoginForm from 'ui-components/LoginForm' // TODO: move out to ui-lib

import { useStoreActions } from 'library/store'

import './LoginPage.style.less'

const LoginPage = () => {
  const history = useHistory()
  const { setAuth } = useStoreActions(actions => actions.user)

  const handleLogin = (result: AuthResult) => {
    setAuth(result)
    history.push('/')
  }

  return (
    <Row justify="center" className="Login">
      <Col xs={20} sm={18} md={14} lg={10} xl={8}>
        <LoginForm onLogin={handleLogin} />
      </Col>
    </Row>
  )
}

export default LoginPage
