declare const portalTokenConfig: {
  lifespan: number
}

declare const portalLocaleConfig: {
  defaultLocale: string
}

declare const portalRolesPagesConfig: {
  home: string[]
}

declare const portalRolesConfig: {
  pages: PortalRolesPagesConfig
}

declare const portalConfig: {
  token: PortalTokenConfig
  l10n: PortalLocaleConfig
  roles: PortalRolesConfig
}

export type PortalConfig = typeof portalConfig
export type PortalTokenConfig = typeof portalTokenConfig
export type PortalLocaleConfig = typeof portalLocaleConfig
export type PortalRolesPagesConfig = typeof portalRolesPagesConfig
export type PortalRolesConfig = typeof portalRolesConfig
export default portalConfig
