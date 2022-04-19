import { useTranslation } from 'react-i18next'
import { Layout } from 'antd'

import './AppHeader.style.less'
import Logo from 'orient-ui-library/assets/orient-logo.svg'
import config from 'config/portal.yaml'

const { Header } = Layout

const AppHeader = () => {
  const { sections } = config
  const { t } = useTranslation()
  console.log('Init sections', sections, t('shortTitle'))
  return (
    <Header className="AppHeader">
      <div className="AppHeader__logo">
        <Logo width={100} height={100} />
      </div>
    </Header>
  )
}

export default AppHeader
