import { useHistory } from 'react-router-dom'

import AppHeader from 'orient-ui-library/components/AppHeader' // TODO: from ui-lib

import { useStoreActions, useStoreState } from 'library/store'

import './CustomerAppHeader.style.less'

export interface CustomerAppHeaderProps {

}

const CustomerAppHeader: React.FC<CustomerAppHeaderProps> = ({}) => {
  const history = useHistory()
  const { setLogout } = useStoreActions(actions => actions.user)
  const user = useStoreState(state => state.user.current)

  const handleLogout = () => {
    setLogout()
    history.push('/')
  }

  return (
    <AppHeader user={user} onLogout={handleLogout} />
  )
}

export default CustomerAppHeader
