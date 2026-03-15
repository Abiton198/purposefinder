import { School, Student, Teacher, ClassRoom, Assignment, Grade, Invoice, Payment, Announcement, TimetableSlot, AttendanceRecord, Message, EnrollmentApplication, User } from '@/types/school';

export const IMAGES = {
  hero: 'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565065075_fcb90b3e.png',
  logo: 'https://d64gsuwffb70l.cloudfront.net/69b661bd93232e8c7aeed108_1773564926367_b084e708.jpeg',
  avatars: [
    'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565083930_11dbcf5f.png',
    'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565082971_f2e073d9.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565085153_89e544f3.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565083459_86bd0a65.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565086089_6bb6290f.png',
    'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565112450_15da873d.png',
  ],
  schools: [
    'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565134682_56d9c91a.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565134763_afd998a1.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565168994_d066779f.png',
  ],
  illustration: 'https://d64gsuwffb70l.cloudfront.net/69b67419544e01e7cff42cae_1773565188084_bd1443f2.jpg',
};

export const demoUsers: User[] = [
  { id: 'u1', name: 'Dr. Sarah Mitchell', email: 'director@purposefinder.edu', role: 'director', avatar: IMAGES.avatars[0], phone: '+1-555-0100' },
  { id: 'u2', name: 'James Anderson', email: 'principal.a@purposefinder.edu', role: 'principal', avatar: IMAGES.avatars[1], schoolId: 's1', phone: '+1-555-0101' },
  { id: 'u3', name: 'Maria Garcia', email: 'principal.b@purposefinder.edu', role: 'principal', avatar: IMAGES.avatars[2], schoolId: 's2', phone: '+1-555-0102' },
  { id: 'u4', name: 'David Thompson', email: 'teacher@purposefinder.edu', role: 'teacher', avatar: IMAGES.avatars[3], schoolId: 's1', phone: '+1-555-0103' },
  { id: 'u5', name: 'Linda Williams', email: 'parent@purposefinder.edu', role: 'parent', avatar: IMAGES.avatars[4], schoolId: 's1', phone: '+1-555-0104' },
  { id: 'u6', name: 'Alex Johnson', email: 'student@purposefinder.edu', role: 'student', avatar: IMAGES.avatars[5], schoolId: 's1', phone: '+1-555-0105' },
];

export const schools: School[] = [
  { id: 's1', name: 'Purpose Finder Academy - Main Campus', code: 'PFA-MC', address: '123 Education Blvd, Springfield, IL', phone: '+1-555-1000', principalId: 'u2', image: IMAGES.schools[0], studentCount: 485, teacherCount: 32, established: '2015' },
  { id: 's2', name: 'Purpose Finder Academy - West Campus', code: 'PFA-WC', address: '456 Learning Ave, Springfield, IL', phone: '+1-555-2000', principalId: 'u3', image: IMAGES.schools[1], studentCount: 372, teacherCount: 24, established: '2018' },
  { id: 's3', name: 'Purpose Finder Academy - East Campus', code: 'PFA-EC', address: '789 Scholar Dr, Springfield, IL', phone: '+1-555-3000', principalId: 'u2', image: IMAGES.schools[2], studentCount: 298, teacherCount: 19, established: '2021' },
];

const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Daniel', 'Emily', 'Michael', 'Ella', 'Sebastian', 'Scarlett', 'Jack', 'Grace', 'Owen', 'Chloe', 'Aiden', 'Victoria', 'Samuel', 'Riley', 'Ryan', 'Aria', 'Nathan', 'Lily', 'Caleb', 'Zoey', 'Christian', 'Penelope', 'Dylan', 'Layla', 'Isaac', 'Nora', 'Joshua', 'Camila', 'Andrew'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'];

export const students: Student[] = Array.from({ length: 60 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  const schoolIdx = i % 3;
  const gradeNum = 6 + (i % 7);
  return {
    id: `st${i + 1}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@student.pfa.edu`,
    schoolId: schools[schoolIdx].id,
    grade: `Grade ${gradeNum}`,
    section: ['A', 'B', 'C'][i % 3],
    parentId: 'u5',
    avatar: IMAGES.avatars[i % 6],
    enrollmentDate: `202${3 + (i % 3)}-0${1 + (i % 9)}-${10 + (i % 20)}`,
    dateOfBirth: `20${10 + (i % 5)}-0${1 + (i % 9)}-${1 + (i % 28)}`,
    gender: i % 2 === 0 ? 'female' : 'male',
    status: i < 55 ? 'active' : 'inactive',
    emergencyContact: `+1-555-${String(2000 + i).padStart(4, '0')}`,
  };
});

const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'Physical Education', 'Computer Science', 'Biology', 'Chemistry', 'Physics'];

export const teachers: Teacher[] = Array.from({ length: 25 }, (_, i) => {
  const fn = firstNames[30 + (i % 20)];
  const ln = lastNames[(i + 10) % lastNames.length];
  return {
    id: `t${i + 1}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@teacher.pfa.edu`,
    schoolId: schools[i % 3].id,
    subjects: [subjects[i % subjects.length], subjects[(i + 3) % subjects.length]],
    avatar: IMAGES.avatars[i % 6],
    phone: `+1-555-${String(3000 + i).padStart(4, '0')}`,
    qualification: ['M.Ed.', 'B.Ed.', 'Ph.D.', 'M.Sc.', 'B.A.'][i % 5],
    joinDate: `20${18 + (i % 7)}-0${1 + (i % 9)}-15`,
    classes: [`Grade ${6 + (i % 4)} ${['A', 'B', 'C'][i % 3]}`],
  };
});

export const classes: ClassRoom[] = Array.from({ length: 18 }, (_, i) => ({
  id: `c${i + 1}`,
  name: `Grade ${6 + (i % 7)} ${['A', 'B', 'C'][i % 3]}`,
  grade: `Grade ${6 + (i % 7)}`,
  section: ['A', 'B', 'C'][i % 3],
  schoolId: schools[Math.floor(i / 6)].id,
  teacherId: `t${(i % 25) + 1}`,
  studentIds: students.filter((_, si) => si % 18 === i).map(s => s.id),
  room: `Room ${100 + i}`,
  capacity: 35,
}));

export const assignments: Assignment[] = Array.from({ length: 20 }, (_, i) => ({
  id: `a${i + 1}`,
  title: [
    'Algebra Problem Set', 'Essay: Climate Change', 'Lab Report: Photosynthesis',
    'History Timeline Project', 'Geography Map Analysis', 'Art Portfolio Review',
    'Music Composition', 'Fitness Assessment', 'Coding Challenge',
    'Biology Cell Diagram', 'Chemistry Equations', 'Physics Motion Problems',
    'Creative Writing', 'Book Report', 'Math Quiz Prep',
    'Science Fair Proposal', 'Debate Preparation', 'Research Paper',
    'Group Presentation', 'Final Exam Review'
  ][i],
  description: `Complete the ${subjects[i % subjects.length]} assignment. Follow all instructions carefully and submit before the deadline.`,
  classId: `c${(i % 18) + 1}`,
  teacherId: `t${(i % 25) + 1}`,
  schoolId: schools[i % 3].id,
  subject: subjects[i % subjects.length],
  dueDate: `2026-03-${String(15 + (i % 15)).padStart(2, '0')}`,
  createdAt: `2026-03-${String(1 + (i % 14)).padStart(2, '0')}`,
  maxScore: [100, 50, 25, 100, 50][i % 5],
  status: i < 15 ? 'active' : 'closed',
}));

export const grades: Grade[] = students.slice(0, 30).map((s, i) => ({
  id: `g${i + 1}`,
  studentId: s.id,
  classId: `c${(i % 18) + 1}`,
  subject: subjects[i % subjects.length],
  term: 'Term 1 2026',
  assignmentScores: [
    { name: 'Assignment 1', score: 70 + (i * 3) % 30, maxScore: 100 },
    { name: 'Assignment 2', score: 65 + (i * 7) % 35, maxScore: 100 },
    { name: 'Assignment 3', score: 60 + (i * 5) % 40, maxScore: 100 },
  ],
  testScores: [
    { name: 'Test 1', score: 30 + (i * 4) % 20, maxScore: 50 },
    { name: 'Test 2', score: 35 + (i * 3) % 15, maxScore: 50 },
  ],
  examScore: { score: 55 + (i * 6) % 45, maxScore: 100 },
  average: Math.round(70 + (i * 3) % 25),
  grade: ['A', 'A', 'B+', 'B', 'B', 'A-', 'B+', 'C+', 'A', 'B'][i % 10],
}));

export const invoices: Invoice[] = students.slice(0, 40).map((s, i) => ({
  id: `inv${i + 1}`,
  studentId: s.id,
  schoolId: s.schoolId,
  term: 'Term 1 2026',
  items: [
    { description: 'Tuition Fee', amount: 2500 },
    { description: 'Transport Fee', amount: 350 },
    { description: 'Meal Plan', amount: 200 },
    { description: 'Technology Fee', amount: 150 },
    { description: 'Extracurricular', amount: 100 },
  ],
  total: 3300,
  paid: i < 20 ? 3300 : i < 30 ? 2500 : 0,
  balance: i < 20 ? 0 : i < 30 ? 800 : 3300,
  status: i < 20 ? 'paid' : i < 30 ? 'partial' : i < 35 ? 'unpaid' : 'overdue',
  dueDate: '2026-03-31',
  createdAt: '2026-01-15',
}));

export const payments: Payment[] = invoices.filter(inv => inv.paid > 0).map((inv, i) => ({
  id: `pay${i + 1}`,
  invoiceId: inv.id,
  studentId: inv.studentId,
  amount: inv.paid,
  method: (['card', 'bank', 'cash', 'mobile'] as const)[i % 4],
  date: `2026-02-${String(1 + (i % 28)).padStart(2, '0')}`,
  reference: `REF-${String(100000 + i)}`,
  status: 'completed',
}));

export const announcements: Announcement[] = [
  { id: 'ann1', title: 'Term 1 Examinations Schedule', content: 'The Term 1 examinations will begin on March 25th. Please ensure all students are prepared. Detailed timetables will be shared with each class.', schoolId: 'all', authorId: 'u1', authorName: 'Dr. Sarah Mitchell', createdAt: '2026-03-10', priority: 'high', targetRoles: ['principal', 'teacher', 'parent', 'student'] },
  { id: 'ann2', title: 'Parent-Teacher Conference', content: 'Annual parent-teacher conferences are scheduled for April 5th. Parents can book slots through the portal starting March 20th.', schoolId: 'all', authorId: 'u1', authorName: 'Dr. Sarah Mitchell', createdAt: '2026-03-08', priority: 'medium', targetRoles: ['parent', 'teacher'] },
  { id: 'ann3', title: 'Sports Day Registration Open', content: 'Registration for the annual inter-campus Sports Day is now open. Events include track and field, swimming, and team sports.', schoolId: 's1', authorId: 'u2', authorName: 'James Anderson', createdAt: '2026-03-05', priority: 'low', targetRoles: ['student', 'parent'] },
  { id: 'ann4', title: 'New Library Resources Available', content: 'Over 500 new books and digital resources have been added to the school library. Students can access e-books through the portal.', schoolId: 's2', authorId: 'u3', authorName: 'Maria Garcia', createdAt: '2026-03-03', priority: 'low', targetRoles: ['student', 'teacher'] },
  { id: 'ann5', title: 'Fee Payment Reminder', content: 'This is a reminder that Term 1 fees are due by March 31st. Late payments will incur a 5% surcharge. Please use the online payment portal.', schoolId: 'all', authorId: 'u1', authorName: 'Dr. Sarah Mitchell', createdAt: '2026-03-12', priority: 'high', targetRoles: ['parent'] },
  { id: 'ann6', title: 'Campus Maintenance Notice', content: 'The East Campus will undergo scheduled maintenance on March 20-21. Classes will continue as normal with temporary room reassignments.', schoolId: 's3', authorId: 'u2', authorName: 'James Anderson', createdAt: '2026-03-01', priority: 'medium', targetRoles: ['teacher', 'student', 'parent'] },
];

export const timetableSlots: TimetableSlot[] = (() => {
  const days: TimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = [
    { start: '08:00', end: '08:45' },
    { start: '08:50', end: '09:35' },
    { start: '09:40', end: '10:25' },
    { start: '10:40', end: '11:25' },
    { start: '11:30', end: '12:15' },
    { start: '13:00', end: '13:45' },
    { start: '13:50', end: '14:35' },
  ];
  const slots: TimetableSlot[] = [];
  let id = 1;
  for (let ci = 0; ci < 6; ci++) {
    for (const day of days) {
      for (let ti = 0; ti < times.length; ti++) {
        slots.push({
          id: `ts${id++}`,
          classId: `c${ci + 1}`,
          schoolId: schools[Math.floor(ci / 2)].id,
          day,
          startTime: times[ti].start,
          endTime: times[ti].end,
          subject: subjects[(ci + ti) % subjects.length],
          teacherId: `t${((ci + ti) % 25) + 1}`,
          room: `Room ${100 + ci}`,
        });
      }
    }
  }
  return slots;
})();

export const attendanceRecords: AttendanceRecord[] = (() => {
  const records: AttendanceRecord[] = [];
  let id = 1;
  const statuses: AttendanceRecord['status'][] = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'absent', 'late', 'present'];
  for (let day = 1; day <= 14; day++) {
    for (let si = 0; si < 30; si++) {
      records.push({
        id: `att${id++}`,
        studentId: `st${si + 1}`,
        classId: `c${(si % 18) + 1}`,
        date: `2026-03-${String(day).padStart(2, '0')}`,
        status: statuses[(si + day) % statuses.length],
        markedBy: `t${(si % 25) + 1}`,
      });
    }
  }
  return records;
})();

export const messages: Message[] = [
  { id: 'm1', senderId: 'u4', senderName: 'David Thompson', receiverId: 'u5', receiverName: 'Linda Williams', subject: 'Alex\'s Progress Report', content: 'Dear Mrs. Williams, I wanted to update you on Alex\'s excellent progress in Mathematics this term. He has shown significant improvement in problem-solving skills.', createdAt: '2026-03-14T10:30:00', read: false },
  { id: 'm2', senderId: 'u5', senderName: 'Linda Williams', receiverId: 'u4', receiverName: 'David Thompson', subject: 'Re: Alex\'s Progress Report', content: 'Thank you for the update, Mr. Thompson. We are very pleased to hear about Alex\'s improvement. Is there anything we can do at home to support his learning?', createdAt: '2026-03-14T14:15:00', read: true },
  { id: 'm3', senderId: 'u2', senderName: 'James Anderson', receiverId: 'u4', receiverName: 'David Thompson', subject: 'Staff Meeting Reminder', content: 'Please remember we have a staff meeting this Friday at 3:30 PM in the conference room. Agenda includes term exam preparations.', createdAt: '2026-03-13T09:00:00', read: true },
  { id: 'm4', senderId: 'u1', senderName: 'Dr. Sarah Mitchell', receiverId: 'u2', receiverName: 'James Anderson', subject: 'Budget Approval', content: 'The budget for the new science lab equipment has been approved. Please proceed with procurement as discussed.', createdAt: '2026-03-12T16:00:00', read: true },
  { id: 'm5', senderId: 'u4', senderName: 'David Thompson', receiverId: 'u5', receiverName: 'Linda Williams', subject: 'Homework Reminder', content: 'Just a reminder that the science project is due next Monday. Alex should prepare his presentation slides as well.', createdAt: '2026-03-11T11:00:00', read: true },
];

export const enrollmentApplications: EnrollmentApplication[] = [
  { id: 'ea1', studentName: 'Sophie Turner', parentName: 'Robert Turner', parentEmail: 'robert.turner@email.com', parentPhone: '+1-555-9001', schoolId: 's1', grade: 'Grade 7', status: 'pending', submittedAt: '2026-03-10', documents: ['birth_certificate.pdf', 'report_card.pdf'] },
  { id: 'ea2', studentName: 'Marcus Chen', parentName: 'Wei Chen', parentEmail: 'wei.chen@email.com', parentPhone: '+1-555-9002', schoolId: 's1', grade: 'Grade 6', status: 'approved', submittedAt: '2026-03-05', documents: ['birth_certificate.pdf', 'immunization.pdf'] },
  { id: 'ea3', studentName: 'Aisha Patel', parentName: 'Raj Patel', parentEmail: 'raj.patel@email.com', parentPhone: '+1-555-9003', schoolId: 's2', grade: 'Grade 8', status: 'pending', submittedAt: '2026-03-12', documents: ['birth_certificate.pdf'] },
  { id: 'ea4', studentName: 'Tyler Brooks', parentName: 'Karen Brooks', parentEmail: 'karen.brooks@email.com', parentPhone: '+1-555-9004', schoolId: 's2', grade: 'Grade 9', status: 'rejected', submittedAt: '2026-02-28', documents: ['birth_certificate.pdf', 'report_card.pdf'], notes: 'Grade capacity reached' },
  { id: 'ea5', studentName: 'Luna Morales', parentName: 'Carlos Morales', parentEmail: 'carlos.morales@email.com', parentPhone: '+1-555-9005', schoolId: 's3', grade: 'Grade 7', status: 'pending', submittedAt: '2026-03-14', documents: ['birth_certificate.pdf', 'medical_records.pdf', 'report_card.pdf'] },
];

// Analytics data for charts
export const enrollmentTrends = [
  { month: 'Sep', mainCampus: 450, westCampus: 340, eastCampus: 260 },
  { month: 'Oct', mainCampus: 458, westCampus: 345, eastCampus: 265 },
  { month: 'Nov', mainCampus: 465, westCampus: 350, eastCampus: 270 },
  { month: 'Dec', mainCampus: 470, westCampus: 355, eastCampus: 278 },
  { month: 'Jan', mainCampus: 475, westCampus: 360, eastCampus: 285 },
  { month: 'Feb', mainCampus: 480, westCampus: 368, eastCampus: 292 },
  { month: 'Mar', mainCampus: 485, westCampus: 372, eastCampus: 298 },
];

export const attendanceTrends = [
  { week: 'W1', rate: 94.2 },
  { week: 'W2', rate: 93.8 },
  { week: 'W3', rate: 95.1 },
  { week: 'W4', rate: 92.5 },
  { week: 'W5', rate: 94.8 },
  { week: 'W6', rate: 96.0 },
  { week: 'W7', rate: 95.3 },
  { week: 'W8', rate: 94.7 },
  { week: 'W9', rate: 95.5 },
  { week: 'W10', rate: 93.9 },
];

export const revenueData = [
  { month: 'Sep', collected: 285000, outstanding: 45000 },
  { month: 'Oct', collected: 310000, outstanding: 38000 },
  { month: 'Nov', collected: 295000, outstanding: 42000 },
  { month: 'Dec', collected: 320000, outstanding: 35000 },
  { month: 'Jan', collected: 340000, outstanding: 30000 },
  { month: 'Feb', collected: 355000, outstanding: 25000 },
  { month: 'Mar', collected: 365000, outstanding: 22000 },
];

export const performanceBySchool = [
  { school: 'Main Campus', average: 78.5, highest: 98, lowest: 45 },
  { school: 'West Campus', average: 76.2, highest: 96, lowest: 42 },
  { school: 'East Campus', average: 80.1, highest: 99, lowest: 48 },
];

export const subjectPerformance = [
  { subject: 'Mathematics', average: 75 },
  { subject: 'English', average: 82 },
  { subject: 'Science', average: 78 },
  { subject: 'History', average: 80 },
  { subject: 'Geography', average: 77 },
  { subject: 'Art', average: 88 },
  { subject: 'Music', average: 85 },
  { subject: 'PE', average: 90 },
  { subject: 'CS', average: 79 },
];

export const feeDistribution = [
  { name: 'Tuition', value: 75.8 },
  { name: 'Transport', value: 10.6 },
  { name: 'Meals', value: 6.1 },
  { name: 'Technology', value: 4.5 },
  { name: 'Extra', value: 3.0 },
];
