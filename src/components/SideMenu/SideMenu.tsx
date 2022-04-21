import { useTranslation } from 'react-i18next'
import { Menu } from 'antd'

import './SideMenu.style.less'
import config from 'config/portal.yaml'

const { Item: MenuItem } = Menu

const SideMenu = () => {
  const { sections } = config
  const { t } = useTranslation()
  return (
    <Menu>
      {sections.map(section => (
        <MenuItem key={section}>{t(`sections.${section}.title`)}</MenuItem>
      ))}
    </Menu>
  )
}

export default SideMenu
