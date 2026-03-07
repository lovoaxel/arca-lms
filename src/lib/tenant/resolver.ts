import type { Tenant } from '@/types/tenant';

export const DEFAULT_TENANT: Tenant = {
  id: 'anahuac',
  slug: 'anahuac',
  name: 'Universidad Anáhuac',
  domain: 'anahuac.arca.edu.mx',
  lmsType: 'brightspace',
  lmsBaseUrl: 'https://anahuac.brightspace.com',
  authProvider: 'azure-ad',
  theme: {
    primaryColor: '#F97316',
    secondaryColor: '#1E293B',
    logoUrl: '/logos/anahuac.png',
    darkMode: true,
  },
  active: true,
};

const TENANTS: Record<string, Tenant> = {
  [DEFAULT_TENANT.domain]: DEFAULT_TENANT,
  localhost: DEFAULT_TENANT,
};

export function resolveTenant(host: string): Tenant {
  const cleanHost = host.split(':')[0];
  return TENANTS[cleanHost] ?? DEFAULT_TENANT;
}
