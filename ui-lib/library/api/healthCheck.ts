import { ApiErrorResponse, get } from 'library/helpers/api'

export async function healthCheck(): Promise<boolean> {
  const result = await get<string | ApiErrorResponse>('health-check')
  if ((result as ApiErrorResponse).error) {
    return false
  }
  return true
}
