import { useTranslation } from 'react-i18next'
import { Menu } from 'antd'

import {
  HomeOutlined,
  UserOutlined,
  BankOutlined,
  FileProtectOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'

import './SideMenu.style.less'
import config from 'config/portal.yaml'

const { Item: MenuItem } = Menu

const MENU_ICONS: Record<string, JSX.Element> = {
  сompany: <HomeOutlined />,
  heads: <UserOutlined />,
  bankDetails: <BankOutlined />,
  documents: <FileProtectOutlined />,
  requests: <UnorderedListOutlined />,
}

const SideMenu = () => {
  const { sections } = config
  const { t } = useTranslation()
  // TODO: save collapsed flag to state?
  // TODO: auto-collapse on mobiles
  return (
    <Menu>
      {sections.map(section => (
        <MenuItem key={section} icon={MENU_ICONS[section]}>
          {t(`sections.${section}.title`)}
        </MenuItem>
      ))}
    </Menu>
  )
}

export default SideMenu
