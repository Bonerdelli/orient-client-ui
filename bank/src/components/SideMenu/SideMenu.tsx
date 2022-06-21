import { useTranslation } from 'react-i18next'
import { Menu } from 'antd'
import { NavLink, useLocation } from 'react-router-dom'

import {
  UnorderedListOutlined,
  BarChartOutlined,
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
      defaultOpenKeys={['orders', 'reports']}
    >
      <SubMenu key="orders" title={t('sections.orders.title')} icon={<UnorderedListOutlined />}>
        <MenuItem key="/frame-orders">
          <NavLink to="frame-orders">
            <>{t('sections.frameOrders.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="simpleFrameOrders">
          <NavLink to="">
            <>{t('sections.simpleFrameOrders.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="factoringOrders">
          <NavLink to="">
            <>{t('sections.factoringOrders.title')}</>
          </NavLink>
        </MenuItem>
      </SubMenu>
      <MenuItem key="reports" icon={<BarChartOutlined />}>
        <>{t('sections.reports.title')}</>
      </MenuItem>
    </Menu>
  )
}

export default SideMenu
