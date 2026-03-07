export interface LMSAdapter {
  getCourses(): Promise<any[]>
  getAssignments(courseId: string): Promise<any[]>
  getGrades(courseId: string): Promise<any[]>
  checkAuth(): Promise<boolean>
}
