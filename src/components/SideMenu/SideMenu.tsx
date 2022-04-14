import { useTranslation } from 'react-i18next'
import { Menu } from 'antd'

import './SideMenu.style.less'

const { Item: MenuItem } = Menu

const SideMenu = () => {
  const { t } = useTranslation()
  return (
    <Menu>
      <MenuItem key="opt1">{t('opt1')}</MenuItem>
    </Menu>
  )
}

export default SideMenu
