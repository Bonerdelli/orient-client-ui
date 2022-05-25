import { Layout } from 'antd'
// import { useTranslation } from 'react-i18next'

import LoginForm from 'orient-ui-library/components/LoginForm'

import './LoginPage.style.less'

const LoginPage = () => {
  // const { t } = useTranslation()
  return (
    <Layout className="Login" data-testid="Login">
      <LoginForm />
    </Layout>
  )
}

export default LoginPage
