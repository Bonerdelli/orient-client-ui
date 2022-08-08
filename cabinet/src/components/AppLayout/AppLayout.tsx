import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useStoreRehydrated } from 'easy-peasy'
import { Spin } from 'antd'

import { getDictionaries, healthCheck } from 'orient-ui-library/library/api'
import { Dictionaries } from 'orient-ui-library/library/models'
import ErrorResultView from 'orient-ui-library/components/ErrorResultView'
import Div from 'orient-ui-library/components/Div'

import { User } from 'library/models/user'
import { useStoreActions, useStoreState } from 'library/store'

import AppLayoutPublic from './AppLayoutPublic'
import AppLayoutProtected from './AppLayoutProtected'

import './AppLayout.style.less'
import { getCompany } from 'library/api'
import AxiosUnauthorizedInterceptor from 'library/hocs/AxiosUnauthorizedInterceptor'


const AppLayout = () => {

  const rehydrated = useStoreRehydrated()
  const user = useStoreState(state => state.user.current)
  const auth = useStoreState(state => state.user.currentAuth)
  const { setCompany, setCompanyId } = useStoreActions(state => state.company)

  const [ loading, setLoading ] = useState<boolean>(true)
  const [ apiError, setApiError ] = useState<string | null>(null)

  const { setDictionaries } = useStoreActions(actions => actions.dictionary)

  const loadHealthStatus = async () => {
    const healthStatus = await healthCheck()
    if (!healthStatus) {
      setApiError('common.errors.apiUnavailable') // FIXME: error component not loading
    }
    return healthStatus
  }

  const initialize = async () => {
    await loadHealthStatus()
    const res = await getDictionaries()
    if (res.success) {
      setDictionaries(res.data as Dictionaries)
    }
    setLoading(false)
  }

  const fetchCompanyInfo = async () => {
    const res = await getCompany()
    if (res.success) {
      setCompany(res?.data?.[0])
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    if (user) {
      setCompanyId((user as User).companyId)
      fetchCompanyInfo()
    }
  }, [ user ])

  if (apiError) {
    return (
      <Div className="AppLayout__globalError">
        <ErrorResultView
          title="common.errors.apiUnavailable.title"
          message={`${apiError}.desc`}
          centered
          fullHeight
          status="error"
        />
      </Div>
    )
  }

  if (loading || !rehydrated) {
    return (
      <Div className="AppLayout__loaderWrap">
        <Spin size="large"/>
      </Div>
    )
  }

  return (
    <BrowserRouter>
      {auth && user
        ? <AxiosUnauthorizedInterceptor>
          <AppLayoutProtected/>
        </AxiosUnauthorizedInterceptor>
        : <AppLayoutPublic/>
      }
    </BrowserRouter>
  )
}

export default AppLayout
