import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Spin } from 'antd'

import { healthCheck } from 'orient-ui-library/library'
import ErrorResultView from 'ui-components/ErrorResultView'
import Div from 'ui-components/Div'

import { useStoreActions, useStoreState } from 'library/store'

import AppLayoutPublic from './AppLayoutPublic'
import AppLayoutProtected from './AppLayoutProtected'

import './AppLayout.style.less'

const AppLayout = () => {

  const user = useStoreState(state => state.user.current)
  const auth = useStoreState(state => state.user.currentAuth)
  const { setUser } = useStoreActions(actions => actions.user)

  const [loading, setLoading] = useState<boolean>(true)
  const [apiError, setApiError] = useState<string | null>(null)

  const loadHealthStatus = async () => {
    const healthStatus = await healthCheck()
    if (!healthStatus) {
      setApiError('common.errors.apiUnavailable') // FIXME: error component not loading
    }
    return healthStatus
  }

  const initialize = async () => {
    await loadHealthStatus()
    setLoading(false)
  }

  useEffect(() => {
    initialize()
  }, [])

  if (apiError) {
    return (
      <Div className="AppLayout__globalError">
        <ErrorResultView
          title="common.errors.apiUnavailable.title"
          message={`${apiError}.desc`}
          status="error"
        />
      </Div>
    )
  }

  if (loading) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large" />
      </Div>
    )
  }

  return (
    <BrowserRouter>
      {auth && user ? <AppLayoutProtected /> : <AppLayoutPublic />}
    </BrowserRouter>
  )
}

export default AppLayout
