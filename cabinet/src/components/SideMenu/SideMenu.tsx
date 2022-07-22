import { useTranslation } from 'react-i18next'
import { Menu } from 'antd'
import { NavLink, useLocation } from 'react-router-dom'

import {
  BankOutlined,
  FileProtectOutlined,
  FormOutlined,
  HomeOutlined,
  ProfileOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { useStoreState } from 'library/store'
import { isCustomer, isClient } from 'library/helpers/user'

import './SideMenu.style.less'
import config from 'config/portal.yaml'

const { Item: MenuItem } = Menu

const MENU_ICONS: Record<string, JSX.Element> = {
  company: <HomeOutlined/>,
  heads: <UserOutlined/>,
  bankDetails: <BankOutlined/>,
  documents: <FileProtectOutlined/>,
  requests: <UnorderedListOutlined/>,
  customerRequests: <UnorderedListOutlined/>,
  toSign: <FormOutlined/>,
  questionnaire: <ProfileOutlined/>,
}

const SideMenu = () => {
  const { sections } = config
  const { t } = useTranslation()
  const location = useLocation()

  const user = useStoreState(state => state.user.current)

  const availableSections = Object.entries(sections)
    .filter(([ section ]) => {
      if (config.roles.pages[section]) {
        if (isClient(user) && !config.roles.pages[section].includes('client')) {
          return false
        }
        if (isCustomer(user) && !config.roles.pages[section].includes('customer')) {
          return false
        }
      }
      return true
    })

  return (
    <Menu selectedKeys={[ location.pathname ]}>
      {availableSections.map(([ section, link ]) => (
        <MenuItem key={link} icon={MENU_ICONS[section]}>
          <NavLink to={link}>
            <>{t(`sections.${section}.title`)}</>
          </NavLink>
        </MenuItem>
      ))}
    </Menu>
  )
}

export default SideMenu
