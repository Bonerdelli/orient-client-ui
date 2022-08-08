import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useStoreActions } from 'library/store'
import { axiosInstance } from 'orient-ui-library/library'

const AxiosUnauthorizedInterceptor = ({ children }) => {
  const history = useHistory()
  const { setLogout } = useStoreActions(actions => actions.user)

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      res => {
        return res
      },
      err => {
        if (err.response.status === 401) {
          setLogout()
          history.push('/login')
        }

        return Promise.reject(err)
      },
    )

    return () => axiosInstance.interceptors.response.eject(interceptor)
  }, [])

  return children
}

export default AxiosUnauthorizedInterceptor
