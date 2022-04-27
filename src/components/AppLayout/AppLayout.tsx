import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { User, ApiErrorResponse /* , get */ } from 'orient-ui-library'

import { useStoreActions, useStoreState } from 'library/store'
import { getCurrentUser } from 'library/api'

import AppLayoutPublic from './AppLayoutPublic'
import AppLayoutProtected from './AppLayoutProtected'

import './AppLayout.style.less'

const AppLayout = () => {
  const user = useStoreState(state => state.user.currentUser)
  const { setCurrentUser } = useStoreActions(actions => actions.user)
  // TODO: loading state for user

  const loadUser = async () => {
    const user = await getCurrentUser()
    if ((user as ApiErrorResponse).error) {
      // TODO: handle errors
    } else {
      setCurrentUser(user as User)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <BrowserRouter>
      {user ? <AppLayoutProtected /> : <AppLayoutPublic />}
    </BrowserRouter>
  )
}

export default AppLayout
