import { useState, useCallback, useEffect } from 'react'

import { ApiError, get, getJson } from 'library/helpers/api'

export type UseJSONDataHookValue<T> = [T | undefined]

export type UseApiDataHookValue<T> = [
  T | undefined,
  (value: T) => void,
  () => Promise<T | undefined>,
]

/**
 * Hook for using data from API
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */
export function useApiData<T>(
  path: string,
  onError?: (error?: ApiError) => void,
): UseApiDataHookValue<T> {
  const [data, setData] = useState<T>()
  const loadData = useCallback(async () => {
    const result = await get(path, onError)
    return result as T
  }, [])

  useEffect(() => {
    const getData = async () => {
      const loadedData = await loadData()
      loadedData && setData(loadedData)
    }
    getData()
  }, [])

  return [data, setData, loadData]
}

/**
 * Hook for fetch and parse external JSON
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */
export function useJson<T>(
  path: string,
  onError?: (error?: ApiError) => void,
): UseJSONDataHookValue<T> {
  const [data, setData] = useState<T>()
  const loadData = useCallback(async () => {
    const result = await getJson(path, onError)
    return result as T
  }, [])

  useEffect(() => {
    const getData = async () => {
      const loadedData = await loadData()
      loadedData && setData(loadedData)
    }
    getData()
  }, [])

  return [data]
}
