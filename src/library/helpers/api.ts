/* TODO: move me to ui-lib after debugging */

import { useState, useCallback, useEffect } from 'react'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
}

export type UseApiHookValue<T> = [
  T | null, // Result data
  boolean | null, // Success or not
]

/**
 * Hook for call API endpoint
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */
export function useApi<T = any, P = any>(
  apiCallback: (params?: P) => Promise<ApiResponse<T>>,
  params?: P
): UseApiHookValue<T> {

  const [ data, setData ] = useState<T | null>(null)
  const [ result, setResult ] = useState<boolean | null>(null)

  const loadData = useCallback(async () => {
    const result = await apiCallback(params)
    if (!result || !result.success) {
      setResult(false)
      return null
    }
    setResult(true)
    return result.data as T
  }, [])

  useEffect(() => {
    const getData = async () => {
      const loadedData = await loadData()
      loadedData && setData(loadedData)
    }
    getData()
  }, [])

  return [ data, result ]
}
