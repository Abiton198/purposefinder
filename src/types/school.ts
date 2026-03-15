export type UserRole = 'director' | 'principal' | 'teacher' | 'parent' | 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  schoolId?: string;
  phone?: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  principalId: string;
  image: string;
  studentCount: number;
  teacherCount: number;
  established: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  schoolId: string;
  grade: string;
  section: string;
  parentId: string;
  avatar: string;
  enrollmentDate: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive' | 'graduated';
  emergencyContact: string;
  medicalInfo?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  schoolId: string;
  subjects: string[];
  avatar: string;
  phone: string;
  qualification: string;
  joinDate: string;
  classes: string[];
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  section: string;
  schoolId: string;
  teacherId: string;
  studentIds: string[];
  room: string;
  capacity: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string;
  note?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  teacherId: string;
  schoolId: string;
  subject: string;
  dueDate: string;
  createdAt: string;
  maxScore: number;
  attachments?: string[];
  status: 'active' | 'closed';
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  content: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  term: string;
  assignmentScores: { name: string; score: number; maxScore: number }[];
  testScores: { name: string; score: number; maxScore: number }[];
  examScore: { score: number; maxScore: number };
  average: number;
  grade: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  schoolId: string;
  term: string;
  items: { description: string; amount: number }[];
  total: number;
  paid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  dueDate: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  method: 'card' | 'bank' | 'cash' | 'mobile';
  date: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  schoolId: string | 'all';
  authorId: string;
  authorName: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  targetRoles: UserRole[];
}

export interface TimetableSlot {
  id: string;
  classId: string;
  schoolId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
  room: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface EnrollmentApplication {
  id: string;
  studentName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  schoolId: string;
  grade: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents: string[];
  notes?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number;
  revenueCollected: number;
  outstandingFees: number;
  averagePerformance: number;
}

export type ViewType = 'landing' | 'dashboard' | 'students' | 'teachers' | 'attendance' | 'grades' | 'assignments' | 'timetable' | 'finance' | 'messages' | 'announcements' | 'enrollment' | 'reports' | 'settings';
