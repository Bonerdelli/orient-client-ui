declare const portalTokenConfig: {
  lifespan: number
}

declare const portalLocaleConfig: {
  defaultLocale: string
}

declare const portalRolesPagesConfig: {
  all: string[]
}

declare const portalDataDisplayConfig: {
  quickSearchMaxItems: number
  numberFractionalLength: number
}

declare const portalRolesConfig: {
  pages: PortalRolesPagesConfig
}

declare const portalConfig: {
  token: PortalTokenConfig
  l10n: PortalLocaleConfig
  roles: PortalRolesConfig
  dataDisplay: PortalDataDisplayConfig
  sections: Record<string, string>
}

export type PortalConfig = typeof portalConfig
export type PortalTokenConfig = typeof portalTokenConfig
export type PortalLocaleConfig = typeof portalLocaleConfig
export type PortalDataDisplayConfig = typeof portalDataDisplayConfig
export type PortalRolesPagesConfig = typeof portalRolesPagesConfig
export type PortalRolesConfig = typeof portalRolesConfig
export default portalConfig
