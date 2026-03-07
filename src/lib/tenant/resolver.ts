import { Tenant } from '@/types/tenant'

export const DEFAULT_TENANT: Tenant = {
  id: 'anahuac',
  slug: 'anahuac',
  name: 'Universidad Anáhuac',
  domain: 'anahuac.brightspace.com',
  primaryColor: '#f97316',
  accentColor: '#ea580c',
  lmsType: 'brightspace',
  lmsBaseUrl: 'https://anahuac.brightspace.com',
  authProvider: 'microsoft',
  createdAt: new Date('2026-01-01'),
}

export async function resolveTenant(host: string): Promise<Tenant> {
  // TODO: lookup tenant by domain in database
  return DEFAULT_TENANT
}
