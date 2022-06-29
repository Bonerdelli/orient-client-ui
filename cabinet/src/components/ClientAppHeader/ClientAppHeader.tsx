import { useTranslation } from 'react-i18next'
import { NavLink, useHistory } from 'react-router-dom'
import { Select, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import AppHeader from 'orient-ui-library/components/AppHeader' // TODO: from ui-lib

import { FRAME_ORDER_PATH, FRAME_SIMPLE_ORDER_PATH, FACTORING_PATH } from 'library/routes'
import { useStoreActions, useStoreState } from 'library/store'

import './ClientAppHeader.style.less'

const { Option } = Select

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

  const renderMainAction = () => (
    <Select
      className="ClientAppHeader__dropdown"
      placeholder={t('orders.actionButton.frameOrder')}
      bordered={false}
    >
      <Option>
        <NavLink to={FRAME_ORDER_PATH} >
          <>{t('orders.actionButton.frameOrder')}</>
        </NavLink>
      </Option>
      <Option>
        <NavLink to={FRAME_SIMPLE_ORDER_PATH}>
          <>{t('orders.actionButton.frameSimpleOrder')}</>
        </NavLink>
      </Option>
      <Option>
        <NavLink to={FACTORING_ORDER_PATH}>
          <>{t('orders.actionButton.factoring')}</>
        </NavLink>
      </Option>
    </Select>
  )
  return (
    <AppHeader user={user} onLogout={handleLogout} mainAction={renderMainAction()} />
  )
}

export default ClientAppHeader
