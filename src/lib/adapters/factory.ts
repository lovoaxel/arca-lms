import type { Tenant } from '@/types/tenant';
import type { LMSAdapter } from './lms-adapter';
import { BrightspaceAdapter } from './brightspace-adapter';

export function getLMSAdapter(tenant: Tenant): LMSAdapter {
  switch (tenant.lmsType) {
    case 'brightspace':
      return new BrightspaceAdapter(tenant);
    default:
      throw new Error(`LMS adapter not implemented for: ${tenant.lmsType}`);
  }
}
