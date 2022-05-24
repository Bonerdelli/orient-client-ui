import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Spin } from 'antd'

import {
  User,
  ApiErrorResponse,
  getCurrentUser,
  healthCheck,
} from 'orient-ui-library/library'

import { Div, ErrorResultView } from 'orient-ui-library/components'

import { useStoreActions, useStoreState } from 'library/store'

import AppLayoutPublic from './AppLayoutPublic'
import AppLayoutProtected from './AppLayoutProtected'

import './AppLayout.style.less'

const AppLayout = () => {
//
  const user = useStoreState(state => state.user.currentUser)
  const { setCurrentUser } = useStoreActions(actions => actions.user)
  // TODO: loading state for user

  const [loading, setLoading] = useState<boolean>(true)
  const [apiError, setApiError] = useState<string | null>(null)

  const loadUser = async () => {
    const user = await getCurrentUser()
    if ((user as ApiErrorResponse).error) {
      // TODO: handle errors
    } else {
      setCurrentUser(user as User)
    }
  }

  const loadHealthStatus = async () => {
    const healthStatus = await healthCheck()
    if (!healthStatus) {
      setApiError('common.errors.apiUnavailable') // FIXME: error component not loading
    }
    return healthStatus
  }

  const initialize = async () => {
    if (await loadHealthStatus()) {
      await loadUser()
    }
    setLoading(false)
  }

  useEffect(() => {
    initialize()
  }, [])

  // if (apiError) {
  //   return (
  //     <Div className="AppLayout__globalError">
  //       <ErrorResultView
  //         title="common.errors.apiUnavailable.title"
  //         message={`${apiError}.desc`}
  //         status="error"
  //       />
  //     </Div>
  //   )
  // }

  if (loading) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <BrowserRouter>
      {user ? <AppLayoutProtected /> : <AppLayoutPublic />}
    </BrowserRouter>
  )
}

export default AppLayout
