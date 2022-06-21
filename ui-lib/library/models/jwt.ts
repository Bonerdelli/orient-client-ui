export interface JwtToken {
  accessToken: string
  refreshToken: string
}

export interface JwtTokenPayload {
  sub: string // NOTE: stringified User
  exp: number
}
