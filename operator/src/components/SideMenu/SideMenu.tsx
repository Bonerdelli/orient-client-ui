import { useTranslation } from 'react-i18next'
import { Menu } from 'antd'
import { NavLink, useLocation } from 'react-router-dom'

import {
  UnorderedListOutlined,
  SettingOutlined,
  BankOutlined,
} from '@ant-design/icons'

import './SideMenu.style.less'

const { Item: MenuItem, SubMenu } = Menu

const SideMenu = () => {
  const { t } = useTranslation()
  const location = useLocation()
  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      defaultOpenKeys={['orders']}
    >
      <MenuItem key="banks" icon={<BankOutlined />}>
        <>{t('sections.banks.title')}</>
      </MenuItem>
      <SubMenu
        key="orders"
        title={t('sections.orders.title')}
        icon={<UnorderedListOutlined />}
      >
        <MenuItem key="/frame-orders">
          <NavLink to="/frame-orders">
            <>{t('sections.frameOrders.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="simpleFrameOrders">
          <NavLink to="/frame-simple-orders">
            <>{t('sections.simpleFrameOrders.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="factoringOrders">
          <NavLink to="/factoring-orders">
            <>{t('sections.factoringOrders.title')}</>
          </NavLink>
        </MenuItem>
      </SubMenu>
      <SubMenu
        key="config"
        title={t('sections.config.title')}
        icon={<SettingOutlined />}
      >
        <MenuItem key="configCommon">
          <NavLink to="">
            <>{t('sections.configCommon.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="configGlobalDocs">
          <NavLink to="">
            <>{t('sections.configGlobalDocs.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="configOrderReqiurements">
          <NavLink to="">
            <>{t('sections.configOrderReqiurements.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="configRevisionReasons">
          <NavLink to="">
            <>{t('sections.configRevisionReasons.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="configRejectReasons">
          <NavLink to="">
            <>{t('sections.configRejectReasons.title')}</>
          </NavLink>
        </MenuItem>
      </SubMenu>
    </Menu>
  )
}

export default SideMenu
