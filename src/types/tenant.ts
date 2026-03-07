export type LMSType = 'brightspace' | 'moodle' | 'canvas' | 'blackboard'
export type AuthProviderType = 'microsoft' | 'google' | 'saml' | 'local'

export interface Tenant {
  id: string
  slug: string
  name: string
  domain: string
  logo?: string
  primaryColor: string
  accentColor: string
  lmsType: LMSType
  lmsBaseUrl: string
  authProvider: AuthProviderType
  createdAt: Date
}

export interface TenantTheme {
  primaryColor: string
  accentColor: string
  logo?: string
  name: string
}
