import { useTranslation } from 'react-i18next'
import { Menu } from 'antd'
import { NavLink, useLocation } from 'react-router-dom'

import {
  HomeOutlined,
  UserOutlined,
  BankOutlined,
  FileProtectOutlined,
  UnorderedListOutlined,
  FormOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'

import './SideMenu.style.less'
import config from 'config/portal.yaml'

const { Item: MenuItem } = Menu

const MENU_ICONS: Record<string, JSX.Element> = {
  company: <HomeOutlined />,
  heads: <UserOutlined />,
  bankDetails: <BankOutlined />,
  documents: <FileProtectOutlined />,
  requests: <UnorderedListOutlined />,
  toSign: <FormOutlined />,
}

const SideMenu = () => {
  const { sections } = config
  const { t } = useTranslation()
  const location = useLocation()
  return (
    <Menu selectedKeys={[location.pathname]}>
      {Object.entries(sections).map(([section, link]) => (
        <MenuItem key={link} icon={MENU_ICONS[section]}>
          <NavLink to={link}>
            <>{t(`sections.${section}.title`)}</>
          </NavLink>
        </MenuItem>
      ))}

      {/* NOTE: separate by repos */}
      <MenuItem key="frame-orders__operator" icon={<EllipsisOutlined />}>
        <NavLink to="/frame-orders__operator">
          <i>Заявки на РД (Оператор)</i>
        </NavLink>
      </MenuItem>
      <MenuItem key="frame-orders__bank" icon={<EllipsisOutlined />}>
        <NavLink to="/frame-orders__bank">
          <i>Заявки на РД (Банк)</i>
        </NavLink>
      </MenuItem>
    </Menu>
  )
}

export default SideMenu
