import { useTranslation } from 'react-i18next'
import { Layout } from 'antd'

import './AppHeader.style.less'
import config from 'config/portal.yaml'

const { Header } = Layout

const AppHeader = () => {
  const { sections } = config
  const { t } = useTranslation()
  return (
    <Header className="AppHeader">
      <div className="logo" />
    </Header>
  )
}

export default AppHeader
