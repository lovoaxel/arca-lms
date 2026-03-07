import type { Course, Assignment, Grade } from '@/types';

export interface LMSAdapter {
  getCourses(userId: string): Promise<Course[]>;
  getAssignments(userId: string): Promise<Assignment[]>;
  getGrades(userId: string): Promise<Grade[]>;
}
