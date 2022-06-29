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
      defaultOpenKeys={['orders']}
    >
      <SubMenu key="orders" title={t('sections.orders.title')} icon={<UnorderedListOutlined />}>
        <MenuItem key="/frame-orders">
          <NavLink to="/frame-orders">
            <>{t('sections.frameOrders.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="/frame-simple-orders">
          <NavLink to="/frame-simple-orders">
            <>{t('sections.simpleFrameOrders.title')}</>
          </NavLink>
        </MenuItem>
        <MenuItem key="/factoring-orders">
          <NavLink to="/factoring-orders">
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
