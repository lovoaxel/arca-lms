// ============================================================
// ARCA — Tenant Types (Multi-tenant SaaS)
// ============================================================

export type LMSType = 'brightspace' | 'moodle' | 'canvas' | 'blackboard';

export type AuthProviderType = 'azure-ad' | 'google' | 'saml' | 'credentials';

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl?: string;
  darkMode?: boolean;
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  domain: string;
  lmsType: LMSType;
  lmsBaseUrl: string;
  authProvider: AuthProviderType;
  theme: TenantTheme;
  active: boolean;
}
