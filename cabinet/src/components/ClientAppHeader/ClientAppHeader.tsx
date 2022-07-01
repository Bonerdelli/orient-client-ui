import { useTranslation } from 'react-i18next'
import { NavLink, useHistory } from 'react-router-dom'
import { Dropdown, Menu, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import AppHeader from 'orient-ui-library/components/AppHeader' // TODO: from ui-lib

import { FRAME_ORDER_PATH, SIMPLE_FRAME_ORDER_PATH, FACTORING_PATH } from 'library/routes'
import { useStoreActions, useStoreState } from 'library/store'

import './ClientAppHeader.style.less'

export interface ClientAppHeaderProps {

}

const ClientAppHeader: React.FC<ClientAppHeaderProps> = ({}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { setLogout } = useStoreActions(actions => actions.user)
  const user = useStoreState(state => state.user.current)

  const handleLogout = () => {
    history.push('/')
    setLogout()
  }

  const menuItems = [
    {
      key: 'frameOrder',
      label: (
        <NavLink to={FRAME_ORDER_PATH} >
          <>{t('orders.actionButton.frameOrder')}</>
        </NavLink>
      ),
    },
    {
      key: 'frameSimpleOrder',
      label: (
        <NavLink to={SIMPLE_FRAME_ORDER_PATH}>
          <>{t('orders.actionButton.frameSimpleOrder')}</>
        </NavLink>
      ),
    },
    {
      key: 'factoring',
      label: (
        <NavLink to={FACTORING_PATH}>
          <>{t('orders.actionButton.factoring')}</>
        </NavLink>
      ),
    },
  ]

  const renderMainAction = () => (
    <Dropdown
      className="ClientAppHeader__dropDownMenu"
      overlay={<Menu items={menuItems} />}
    >
      <Space>
        {t('orders.actionButton.title')}
        <PlusOutlined />
      </Space>
    </Dropdown>
  )
  return (
    <AppHeader user={user} onLogout={handleLogout} mainAction={renderMainAction()} />
  )
}

export default ClientAppHeader
