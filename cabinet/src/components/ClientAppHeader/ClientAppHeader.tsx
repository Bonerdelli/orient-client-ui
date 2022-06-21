import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import AppHeader from 'orient-ui-library/components/AppHeader' // TODO: from ui-lib

import { FRAME_ORDER_PATH } from 'library/routes'

import { useStoreActions, useStoreState } from 'library/store'

import './ClientAppHeader.style.less'

export interface ClientAppHeaderProps {

}

const ClientAppHeader: React.FC<ClientAppHeaderProps> = ({}) => {
  const { t } = useTranslation()
  const { setLogout } = useStoreActions(actions => actions.user)
  const user = useStoreState(state => state.user.current)

  const renderMainAction = () => (
    <NavLink to={FRAME_ORDER_PATH} className="ClientAppHeader__buttonLink">
      <Button type="link" icon={<PlusOutlined />}>
        <>{t('orders.actionButton.title')}</>
      </Button>
    </NavLink>
  )
  return (
    <AppHeader user={user} onLogout={() => setLogout()} mainAction={renderMainAction()} />
  )
}

export default ClientAppHeader
