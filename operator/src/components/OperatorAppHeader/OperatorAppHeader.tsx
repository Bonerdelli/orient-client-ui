import { useHistory } from 'react-router-dom'

import AppHeader from 'orient-ui-library/components/AppHeader'

import { useStoreActions, useStoreState } from 'library/store'

import './OperatorAppHeader.style.less'

export interface OperatorAppHeaderProps {

}

const OperatorAppHeader: React.FC<OperatorAppHeaderProps> = ({}) => {
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

export default OperatorAppHeader
