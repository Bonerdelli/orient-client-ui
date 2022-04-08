import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'

import './Login.style.less'

const { Paragraph } = Typography

const Login = () => {
  const { t } = useTranslation()
  return (
    <div className="Login" data-testid="Login">
      <Paragraph>{t('Login.component')}</Paragraph>
    </div>
  )
}

export default Login
