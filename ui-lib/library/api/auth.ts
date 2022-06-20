import { post } from 'library/helpers/api'

import * as schema from 'library/api/schema'

export type AuthRequest = schema.components['schemas']['AuthResponseDto']
export type AuthResponse = schema.components['schemas']['ServerResponseAuthResponseDto']
export type AuthResult = schema.components['schemas']['AuthResponseDto']

export async function auth(login: string, password: string): Promise<AuthResult | false> {
  const payload = { login, password }
  const result = await post<AuthResponse>('/auth/login', payload) as AuthResponse // TODO: replace or ditch ErrorResponse
  if (!result.success || !result.data) {
    return false
  }
  return result.data
}
