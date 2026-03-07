import type { Course, Assignment, Grade } from '@/types';
import type { LMSAdapter } from './lms-adapter';
import type { Tenant } from '@/types/tenant';

export class BrightspaceAdapter implements LMSAdapter {
  private tenant: Tenant;

  constructor(tenant: Tenant) {
    this.tenant = tenant;
  }

  async getCourses(userId: string): Promise<Course[]> {
    const res = await fetch(`/api/brightspace/cursos?userId=${userId}`);
    const json = await res.json();
    return json.data ?? [];
  }

  async getAssignments(userId: string): Promise<Assignment[]> {
    const res = await fetch(`/api/brightspace/tareas?userId=${userId}`);
    const json = await res.json();
    return json.data ?? [];
  }

  async getGrades(userId: string): Promise<Grade[]> {
    const res = await fetch(`/api/brightspace/calificaciones?userId=${userId}`);
    const json = await res.json();
    return json.data ?? [];
  }
}
