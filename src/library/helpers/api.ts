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

// TODO: to ui-lib
export interface PaginatedRequest {
  limit: number,
  page: number,
}

export interface UseApiHookOptions {
  catchUnauthorized: boolean
}

export type UseApiHookValue<T> = [
  T | null, // Result data
  boolean | null, // Success or not or null when loading
  () => Promise<void>, // Data reload callback
]

const defaultOptions: UseApiHookOptions = {
  catchUnauthorized: true,
}

export const DEFAULT_PAGINATION_LIMIT = 100

export const defaultPaginatedRequest: PaginatedRequest = {
  limit: DEFAULT_PAGINATION_LIMIT,
  page: 1,
}

/**
 * Helper function for call API endpoint and retrieve data
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */

export async function callApi<T = unknown, P = unknown, R = unknown>(
  apiCallback: (requestParameters?: P, requestData?: R) => Promise<ApiResponse<T>>,
  requestParameters?: P,
  requestData?: R,
  onResult?: (result: boolean) => void,
  onError?: (error: string) => void,
  onUnauthorized?: () => void,
): Promise<T | null> {
  const result = await apiCallback(requestParameters, requestData)
  if (
    onUnauthorized &&
    (result as ApiErrorResponse)?.status === 403
  ) {
    onUnauthorized && onUnauthorized()
    return null
  }
  if ((result as ApiErrorResponse)?.error) {
    onError && onError((result as ApiErrorResponse)?.error)
  }
  if (!(result as ApiResponse<T>)?.success) {
    onResult && onResult(false)
    return null
  }
  onResult && onResult(true)
  return (result as ApiSuccessResponse<T>).data as T
}

/**
 * Hook for call API endpoint and retrieve data
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

  const getData = async () => {
    const loadedData = await callApi(
      apiCallback,
      requestParameters,
      requestData,
      (result) => setResult(result),
      () => message.error(t('common.errors.dataLoadingError.title')),
      () => opts.catchUnauthorized && setLogout(),
    )
    setData(loadedData)
  }

  useEffect(() => { getData() }, [])

  return [ data, result, getData ]
}
