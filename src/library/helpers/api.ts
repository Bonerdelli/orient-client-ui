/* TODO: move me to ui-lib after debugging */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { message } from 'antd';

import {
  ApiResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
} from 'orient-ui-library/library/helpers/api'

import { useStoreActions } from 'library/store'


export interface UseApiHookOptions {
  catchUnauthorized: boolean
}

export type UseApiHookValue<T> = [
  T | null, // Result data
  boolean | null, // Success or not or null when loading
]

const defaultOptions: UseApiHookOptions = {
  catchUnauthorized: true,
}

/**
 * Hook for call CRUD endpoint and retrieve data from API
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */
export function useApi<T = unknown, P = unknown, R = unknown>(
  apiCallback: (requestParameters?: P, requestData?: R) => Promise<ApiResponse<T>>,
  requestParameters?: P,
  requestData?: R,
  opts: UseApiHookOptions = defaultOptions,
): UseApiHookValue<T> {
  const { t } = useTranslation()
  const { setLogout } = useStoreActions(actions => actions.user)

  const [ data, setData ] = useState<T | null>(null)
  const [ result, setResult ] = useState<boolean | null>(null)

  const loadData: () => Promise<T | null> = async () => {
    const result = await apiCallback(requestParameters, requestData)
    if (
      opts.catchUnauthorized &&
      (result as ApiErrorResponse)?.status === 403
    ) {
      setLogout()
      return null
    }
    if ((result as ApiErrorResponse)?.error) {
      message.error(t('common.errors.dataLoadingError.title'))
    }
    if (!(result as ApiResponse<T>)?.success) {
      setResult(false)
      return null
    }
    setResult(true)
    return (result as ApiSuccessResponse<T>).data as T
  }

  useEffect(() => {
    const getData = async () => {
      const loadedData = await loadData()
      setData(loadedData)
    }
    getData()
  }, [])

  return [ data, result ]
}
