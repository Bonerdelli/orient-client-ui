/**
 * API integration functions and helpers
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */

import axios, { AxiosError } from 'axios'
import { Middleware } from 'redux'

import { downloadBinaryFile } from 'library/helpers/file'

export const API_URL = process.env.API_PROXIED_PATH
  ? `${process.env.API_PROXIED_PATH}/${process.env.API_VERSION}`
  : `${process.env.API_URL}/${process.env.API_VERSION}`

export const REQUEST_TIMEOUT = 5000 // in milliseconds

axios.defaults.timeout = REQUEST_TIMEOUT

export interface ApiErrorResponse {
  success?: false
  status?: number
  error: string
  message?: string
  path?: string
}

export interface ApiSuccessResponse<T = unknown> {
  success?: boolean
  data?: T
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Redux Middleware to set-up authorization header
 */
function createAuthMiddleware(): Middleware {
  return () => next => action => {
    let token: string | null = null
    switch (action.type) {
      case '@action.ePRS':
        token = action.payload?.user?.currentAuth?.accessToken ?? ''
        break
      case '@action.user.setAuth':
        token = action.payload?.accessToken ?? ''
        break
      case '@action.user.setLogout':
        token = ''
        break
      default:
    }
    if (token !== null) {
      axios.defaults.headers.common.Authorization = token ? `Bearer ${token}` : ''
    }
    return next(action)
  };
}

export const axiosMiddleware = createAuthMiddleware()

/**
 * Fetch and parse JSON from backend
 */
export async function get<T>(
  path: string,
  onError?: (error?: ApiErrorResponse) => void,
): Promise<ApiResponse<T>> {
  try {
    const url = getEndpointUrl(path)
    const response = await axios.get(url)
    return response.data
  } catch (err: any) {
    return handleApiError(err, onError)
  }
}

/**
 * Download binary file from backend
 */
export async function getFile(
  path: string,
  fileName: string,
  onError?: (error?: ApiErrorResponse) => void,
  isPathAbsolute?: boolean
): Promise<boolean> {
  try {
    const url = isPathAbsolute ? path : getEndpointUrl(path)
    const response = await axios.get(url, {
      responseType: 'blob',
    })
    if (!response.data) {
      throw new Error('Empty response')
    }
    downloadBinaryFile(response.data, fileName)
  } catch (err: any) {
    handleApiError(err, onError)
    return false
  }
  return true
}

/**
 * Download binary file from Minio
 */
export async function getS3File(
  url: string,
  fileName: string,
  onError?: (error?: ApiErrorResponse) => void,
): Promise<boolean> {
  try {
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: '',
      }
    })
    if (!response.data) {
      throw new Error('Empty response')
    }
    downloadBinaryFile(response.data, fileName)
  } catch (err: any) {
    handleApiError(err, onError)
    return false
  }
  return true
}

/**
 * POST request
 */
export async function post<T, P = any>(
  path: string,
  payload: P,
  onError?: (error?: ApiErrorResponse) => void,
): Promise<ApiResponse<T>> {
  try {
    const url = getEndpointUrl(path)
    const response = await axios.post(url, payload)
    return response.data
  } catch (err: any) {
    return handleApiError(err, onError)
  }
}

/**
 * DELETE request
 */
export async function del(
  path: string,
  onError?: (error?: ApiErrorResponse) => void,
): Promise<boolean> {
  try {
    const url = getEndpointUrl(path)
    await axios.delete(url)
    return true
  } catch (err: any) {
    handleApiError(err, onError)
  }
  return false
}

/**
 * Helper function to check if request was successful
 */
export function isSuccessful<T = void>(
  result: ApiSuccessResponse<T>,
): boolean {
  if (typeof result === 'undefined') {
    return false
  }
  return (result as ApiSuccessResponse)?.success ?? false
}

/**
 * Helper function to build endpoint URL
 */
export function getEndpointUrl(path: string): string {
  const url = path.replace(/^\/+/, '').replace(/\/+$/, '')
  return `${API_URL}/${url}`
}

/**
 * Helper function to handle API errors
 */
function handleApiError(
  error?: AxiosError<ApiErrorResponse>,
  onError?: (error?: ApiErrorResponse) => void,
): ApiErrorResponse {
  const errorResponse = error?.response?.data
  if (onError) {
    onError(errorResponse)
  } else {
    console.error('API Error', error?.message) // eslint-disable-line no-console
  }
  if (errorResponse) {
    return { ...errorResponse }
  }
  return {
    status: error?.response?.status,
    error: 'Unknown API error' ,
  }
}
