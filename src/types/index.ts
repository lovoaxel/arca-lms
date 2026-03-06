// ============================================================
// Brightspace Plus — TypeScript Types
// ============================================================

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  avatarUrl?: string;
  program: string;
  semester: number;
}

export type CourseStatus = 'active' | 'completed' | 'upcoming';

export interface Course {
  id: string;
  name: string;
  shortName: string;
  code: string;
  professor: string;
  credits: number;
  status: CourseStatus;
  progress: number; // 0–100
  color: string; // Tailwind bg class or hex
  nextDeadline?: Assignment;
  currentGrade?: number;
  description?: string;
}

export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'late' | 'missing';
export type AssignmentPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseColor?: string;
  dueDate: string; // ISO 8601
  status: AssignmentStatus;
  priority: AssignmentPriority;
  grade?: number;
  maxGrade: number;
  description?: string;
  submissionUrl?: string;
  attachments?: string[];
}

export type CalendarEventType = 'assignment' | 'exam' | 'class' | 'reminder' | 'holiday';

export interface CalendarEvent {
  id: string;
  title: string;
  courseId?: string;
  courseName?: string;
  courseColor?: string;
  date: string; // ISO 8601
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  type: CalendarEventType;
  description?: string;
  location?: string;
  isAllDay: boolean;
  color?: string;
}

export interface Grade {
  id: string;
  courseId: string;
  courseName: string;
  assignmentId?: string;
  assignmentTitle: string;
  grade: number;
  maxGrade: number;
  percentage: number;
  gradedAt: string; // ISO 8601
  feedback?: string;
  category?: string; // e.g. 'Examen', 'Tarea', 'Proyecto'
}

export interface CourseGradeSummary {
  courseId: string;
  courseName: string;
  currentGrade: number;
  letterGrade: string;
  gradesByCategory: Record<string, Grade[]>;
  grades: Grade[];
}

export interface DashboardStats {
  pendingAssignments: number;
  upcomingDeadlines: number; // next 7 days
  overallAverage: number;
  activeCourses: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'assignment' | 'grade' | 'announcement' | 'reminder';
  courseId?: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
