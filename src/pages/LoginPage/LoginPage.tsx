import { Row, Col } from 'antd'
// import { useTranslation } from 'react-i18next'

import LoginForm from 'ui-components/LoginForm'

import './LoginPage.style.less'

const LoginPage = () => {
  // const { t } = useTranslation()
  return (
    <Row align="middle" justify="center" className="Login">
      <Col span={8}>
        <LoginForm />
      </Col>
    </Row>
  )
}

export default LoginPage
