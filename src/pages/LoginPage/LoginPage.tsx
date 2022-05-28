import { Row, Col } from 'antd'
import { useHistory } from 'react-router-dom'
import { AuthResult } from 'orient-ui-library'

// TODO: use a REAL user when be will be ready
import mockUser from 'orient-ui-library/library/mock/user'

import LoginForm from 'ui-components/LoginForm' // TODO: move out to ui-lib

import { useStoreActions } from 'library/store'

import './LoginPage.style.less'

const LoginPage = () => {
  const history = useHistory()
  const { setUser, setAuth } = useStoreActions(actions => actions.user)

  const handleLogin = (result: AuthResult) => {
    setAuth(result)
    setUser(mockUser)
    history.push('/')
  }

  return (
    <Row justify="center" className="Login">
      <Col span={8}>
        <LoginForm onLogin={handleLogin} />
      </Col>
    </Row>
  )
}

export default LoginPage
