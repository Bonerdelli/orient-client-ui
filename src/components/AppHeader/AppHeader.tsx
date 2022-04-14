import { useTranslation } from 'react-i18next'
import { Layout } from 'antd'

import './AppHeader.style.less'

const { Header } = Layout

const AppHeader = () => {
  const { t } = useTranslation()
  return (
    <Header className="AppHeader">
      <div className="logo" />
    </Header>
  )
}

export default AppHeader
