/* TODO: move me to ui-lib after debugging */

import { AxiosError } from 'axios'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { message } from 'antd';

import { useStoreActions } from 'library/store'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
}

export interface ApiErrorResult<T, P> {
  error?: AxiosError<T, P>
}

export interface UseApiOptions {
  catchUnauthorized: boolean
}

export type UseApiHookValue<T> = [
  T | null, // Result data
  boolean | null, // Success or not
]

const defaultOptions: UseApiOptions = {
  catchUnauthorized: true
}

/**
 * Hook for call API endpoint
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */
export function useApi<T = any, P = any>(
  apiCallback: (requestData?: P) => Promise<ApiResponse<T> | null>,
  requestData?: P,
  opts: UseApiOptions = defaultOptions,
): UseApiHookValue<T> {
  const { t } = useTranslation()
  const { setLogout } = useStoreActions(actions => actions.user)

  const [ data, setData ] = useState<T | null>(null)
  const [ result, setResult ] = useState<boolean | null>(null)

  const loadData = async () => {
    const result = await apiCallback(requestData)
    if (
      opts.catchUnauthorized &&
      (result as ApiErrorResult<T, P>)?.error?.response?.status === 403
    ) {
      setLogout()
      return null
    }
    if ((result as ApiErrorResult<T, P>)?.error) {
      message.error(t('common.errors.dataLoadingError.title'))
    }
    if (!result || !(result as ApiResponse<T>).success) {
      setResult(false)
      return null
    }
    setResult(true)
    return (result as ApiResponse<T>).data as T
  }

  useEffect(() => {
    const getData = async () => {
      const loadedData = await loadData()
      loadedData && setData(loadedData)
    }
    getData()
  }, [])

  return [ data, result ]
}
