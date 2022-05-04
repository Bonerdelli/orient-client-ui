import { useTranslation } from 'react-i18next'
import { Layout, Typography } from 'antd'

import './Login.style.less'

const { Paragraph } = Typography

const Login = () => {
  const { t } = useTranslation()
  return (
    <Layout className="Login" data-testid="Login">
      <Paragraph>{t('Login.component')}</Paragraph>
    </Layout>
  )
}

export default Login
