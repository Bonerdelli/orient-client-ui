/**
 * Helpers to handle API queries
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package orient-ui
 */

import request, { Response } from 'superagent'

export const API_URL = process.env.API_URL || 'http://localhost:3001'
export const REQUEST_TIMEOUT = 5000 // in milliseconds
export const REQUEST_MAX_TIME = 20000 // in milliseconds

export interface ApiError {
  code?: string
  status?: number
  message: string
}

export interface ApiErrorResponse {
  statusCode?: number
  error: ApiError
}

export interface ApiSuccessResponse {
  success?: boolean
}

export type ApiCrudResponse<T = ApiSuccessResponse> = T | ApiErrorResponse

/**
 * Fetch and parse JSON file
 */
export async function getJson<T>(
  path: string,
  onError?: (error?: ApiError) => void,
): Promise<T | ApiErrorResponse> {
  let serverError: ApiErrorResponse | null = null
  const response = await request
    .get(path)
    .timeout({
      response: REQUEST_TIMEOUT,
      deadline: REQUEST_MAX_TIME,
    })
    .type('json')
    .accept('json')
    .catch((err) => {
      serverError = handleApiError(err, onError)
    })
  if (serverError) {
    return serverError
  }
  const result = (response as Response)?.body
  if (result?.error) {
    return handleApiError(result.error, onError)
  }
  return result
}

/**
 * Fetch and parse JSON from backend
 */
export async function get<T>(
  path: string,
  onError?: (error?: ApiError) => void,
): Promise<T | ApiErrorResponse> {
  let serverError: ApiErrorResponse | null = null
  const url = getEndpointUrl(path)
  const jwtToken = '' // TODO: read from store?
  const response = await request
    .get(url)
    .timeout({
      response: REQUEST_TIMEOUT,
      deadline: REQUEST_MAX_TIME,
    })
    .type('json')
    .accept('json')
    .set('Authorization', `Bearer ${jwtToken}`)
    .catch((err) => {
      serverError = handleApiError(err, onError)
    })
  if (serverError) {
    return serverError
  }
  const result = (response as Response)?.body
  if (result?.error) {
    return handleApiError(result.error, onError)
  }
  return result
}

/**
 * POST request
 */
export async function post<T = void>(
  path: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  payload: any,
  onError?: (error?: ApiError) => void,
): Promise<ApiCrudResponse<T>> {
  let serverError: ApiErrorResponse | null = null
  const url = getEndpointUrl(path)
  const jwtToken = '' // TODO: read from store?
  const response = await request
    .post(url)
    .timeout({
      response: REQUEST_TIMEOUT,
      deadline: REQUEST_MAX_TIME,
    })
    .type('json')
    .accept('json')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(payload)
    .catch((err) => {
      serverError = handleApiError(err, onError)
    })
  if (serverError) {
    return serverError
  }
  const result = (response as Response)?.body
  if (result?.error) {
    return handleApiError(result.error, onError)
  }
  return result
}

/**
 * PUT request
 */
export async function put<T = void>(
  path: string,
  payload?: any,
  onError?: (error?: ApiError) => void,
): Promise<ApiCrudResponse<T>> {
  let serverError: ApiErrorResponse | null = null
  const url = getEndpointUrl(path)
  const jwtToken = '' // TODO: read from store?
  const response = await request
    .put(url)
    .timeout({
      response: REQUEST_TIMEOUT,
      deadline: REQUEST_MAX_TIME,
    })
    .type('json')
    .accept('json')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(payload)
    .catch((err) => {
      serverError = handleApiError(err, onError)
    })
  if (serverError) {
    return serverError
  }
  const result = (response as Response)?.body
  if (result?.error) {
    return handleApiError(result.error, onError)
  }
  return result
}

/**
 * DELETE request
 */
export async function del<T = void>(
  path: string,
  onError?: (error?: ApiError) => void,
): Promise<ApiCrudResponse<T>> {
  let serverError: ApiErrorResponse | null = null
  const url = getEndpointUrl(path)
  const jwtToken = '' // TODO: read from store?
  const response = await request
    .delete(url)
    .timeout({
      response: REQUEST_TIMEOUT,
      deadline: REQUEST_MAX_TIME,
    })
    .type('json')
    .accept('json')
    .set('Authorization', `Bearer ${jwtToken}`)
    .catch((err) => {
      serverError = handleApiError(err, onError)
    })
  if (serverError) {
    return serverError
  }
  const result = (response as Response)?.body
  if (result?.error) {
    return handleApiError(result.error, onError)
  }
  return result
}

/**
 * Helper function to check if request was successful
 */
export function isSuccessful<T = void>(
  result: ApiCrudResponse<T | ApiSuccessResponse>,
): boolean {
  if (typeof result === 'undefined') {
    return false
  }
  if ((result as ApiErrorResponse).error) {
    return false
  }
  if ((result as ApiSuccessResponse).success) {
    return true
  }
  return true
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
  error?: ApiError,
  onError?: (error?: ApiError) => void,
): ApiErrorResponse {
  if (onError) {
    onError(error)
  } else {
    // TODO: add displaying of error messages using Snackbar
    console.error('API Error', error?.message) // eslint-disable-line no-console
  }
  if (error) {
    return { error }
  }
  return {
    error: { message: 'Неизвестная ошибка' },
  }
}
