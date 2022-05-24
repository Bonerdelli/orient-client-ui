import { useTranslation } from 'react-i18next'
import { Layout } from 'antd'

import { LoginForm } from 'orient-ui-library/components/LoginForm'

import './Login.style.less'

const Login = (): React.FC => {
  const { t } = useTranslation()
  return (
    <Layout className="Login" data-testid="Login">
      <LoginForm />
    </Layout>
  )
}

export default Login
