import { useHistory } from 'react-router-dom'

import AppHeader from 'orient-ui-library/components/AppHeader'

import { useStoreActions, useStoreState } from 'library/store'

import './BankAppHeader.style.less'

export interface BankAppHeaderProps {

}

const BankAppHeader: React.FC<BankAppHeaderProps> = ({}) => {
  const history = useHistory()
  const { setLogout } = useStoreActions(actions => actions.user)
  const user = useStoreState(state => state.user.current)

  const handleLogout = () => {
    setLogout()
    history.push('/')
  }

  const renderMainAction = () => (
    <></>
  )
  return (
    <AppHeader user={user} onLogout={handleLogout} mainAction={renderMainAction()} />
  )
}

export default BankAppHeader
