import { Tenant } from '@/types/tenant'
import { LMSAdapter } from './lms-adapter'
import { BrightspaceAdapter } from './brightspace-adapter'

export function getLMSAdapter(tenant: Tenant): LMSAdapter {
  switch (tenant.lmsType) {
    case 'brightspace':
      return new BrightspaceAdapter(tenant.lmsBaseUrl)
    case 'moodle':
      // TODO: implement MoodleAdapter
      return new BrightspaceAdapter(tenant.lmsBaseUrl)
    case 'canvas':
      // TODO: implement CanvasAdapter
      return new BrightspaceAdapter(tenant.lmsBaseUrl)
    case 'blackboard':
      // TODO: implement BlackboardAdapter
      return new BrightspaceAdapter(tenant.lmsBaseUrl)
    default:
      return new BrightspaceAdapter(tenant.lmsBaseUrl)
  }
}
