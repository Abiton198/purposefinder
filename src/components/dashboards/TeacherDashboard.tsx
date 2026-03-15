import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import StatCard from '@/components/ui/StatCard';
import { students, assignments, classes, messages, timetableSlots } from '@/data/mockData';
import { AttendanceRecord } from '@/types/school';
import {
  Users, BookOpen, ClipboardCheck, MessageSquare, Calendar, FileText,
  Check, X, Clock, AlertCircle, Plus, Send
} from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { currentUser, setCurrentView, attendanceRecords, markAttendance } = useSchool();
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'gradebook' | 'assignments'>('overview');
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: '', dueDate: '', description: '' });

  const teacherId = currentUser?.id || 'u4';
  const schoolId = currentUser?.schoolId || 's1';
  const myClasses = classes.filter(c => c.schoolId === schoolId).slice(0, 3);
  const myStudents = students.filter(s => s.schoolId === schoolId).slice(0, 20);
  const myAssignments = assignments.filter(a => a.schoolId === schoolId).slice(0, 8);
  const myMessages = messages.filter(m => m.senderId === teacherId || m.receiverId === teacherId);
  const todaySlots = timetableSlots.filter(t => t.day === 'Monday' && t.schoolId === schoolId).slice(0, 7);

  const today = '2026-03-15';
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const records: AttendanceRecord[] = Object.entries(attendanceState).map(([studentId, status]) => ({
      id: `att-new-${studentId}-${today}`,
      studentId,
      classId: myClasses[0]?.id || 'c1',
      date: today,
      status,
      markedBy: teacherId,
    }));
    if (records.length > 0) {
      markAttendance(records);
    }
  };

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.subject) {
      setShowCreateAssignment(false);
      setNewAssignment({ title: '', subject: '', dueDate: '', description: '' });
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'attendance' as const, label: 'Mark Attendance' },
    { id: 'gradebook' as const, label: 'Gradebook' },
    { id: 'assignments' as const, label: 'Assignments' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <h2 className="text-2xl font-bold">Good Morning, {currentUser?.name?.split(' ')[0]}</h2>
          <p className="text-emerald-100 mt-1">You have {todaySlots.length} classes today</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Students" value={myStudents.length} icon={Users} iconColor="text-emerald-600" iconBg="bg-emerald-100" />
        <StatCard title="Active Assignments" value={myAssignments.filter(a => a.status === 'active').length} icon={FileText} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard title="Classes Today" value={todaySlots.length} icon={Calendar} iconColor="text-purple-600" iconBg="bg-purple-100" />
        <StatCard title="Unread Messages" value={myMessages.filter(m => !m.read && m.receiverId === teacherId).length} icon={MessageSquare} iconColor="text-amber-600" iconBg="bg-amber-100" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-2">
              {todaySlots.map((slot, i) => (
                <div key={slot.id} className={`flex items-center gap-4 p-3 rounded-lg ${i === 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'}`}>
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-semibold text-gray-900">{slot.startTime}</div>
                    <div className="text-xs text-gray-500">{slot.endTime}</div>
                  </div>
                  <div className="w-0.5 h-10 bg-emerald-300 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{slot.subject}</div>
                    <div className="text-xs text-gray-500">{slot.room}</div>
                  </div>
                  {i === 0 && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Current</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Messages</h3>
              <button onClick={() => setCurrentView('messages')} className="text-sm text-emerald-600 font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {myMessages.slice(0, 4).map(msg => (
                <div key={msg.id} className={`p-3 rounded-lg border ${!msg.read && msg.receiverId === teacherId ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100'}`}>
                  <div className="text-sm font-medium text-gray-900">{msg.subject}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{msg.senderName}</div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-1">{msg.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Mark Attendance - {today}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{myClasses[0]?.name || 'Grade 6 A'}</p>
            </div>
            <button
              onClick={handleSaveAttendance}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Attendance
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Present</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Absent</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Late</th>
                </tr>
              </thead>
              <tbody>
                {myStudents.slice(0, 15).map(student => {
                  const status = attendanceState[student.id];
                  return (
                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <span className="text-sm font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{student.grade}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleMarkAttendance(student.id, 'present')}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            status === 'present' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleMarkAttendance(student.id, 'absent')}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            status === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleMarkAttendance(student.id, 'late')}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            status === 'late' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-amber-100 hover:text-amber-600'
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'gradebook' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Digital Gradebook</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">HW 1</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">HW 2</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Test 1</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Test 2</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Exam</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Average</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Grade</th>
                </tr>
              </thead>
              <tbody>
                {myStudents.slice(0, 12).map((student, i) => {
                  const hw1 = 70 + (i * 3) % 30;
                  const hw2 = 65 + (i * 7) % 35;
                  const t1 = 60 + (i * 4) % 40;
                  const t2 = 70 + (i * 5) % 30;
                  const exam = 55 + (i * 6) % 45;
                  const avg = Math.round((hw1 + hw2 + t1 + t2 + exam) / 5);
                  const grade = avg >= 90 ? 'A' : avg >= 80 ? 'B' : avg >= 70 ? 'C' : avg >= 60 ? 'D' : 'F';
                  const gradeColor = avg >= 80 ? 'text-green-600 bg-green-50' : avg >= 70 ? 'text-blue-600 bg-blue-50' : avg >= 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
                  return (
                    <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <span className="text-sm font-medium text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">{hw1}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">{hw2}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">{t1}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">{t2}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">{exam}</td>
                      <td className="py-3 px-4 text-center text-sm font-semibold text-gray-900">{avg}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColor}`}>{grade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">My Assignments</h3>
            <button
              onClick={() => setShowCreateAssignment(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Assignment
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {myAssignments.map(assignment => (
              <div key={assignment.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{assignment.subject}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    assignment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>{assignment.status}</span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {assignment.dueDate}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Max: {assignment.maxScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateAssignment(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                <input type="text" value={newAssignment.title} onChange={(e) => setNewAssignment(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" placeholder="Assignment title..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
                <input type="text" value={newAssignment.subject} onChange={(e) => setNewAssignment(p => ({ ...p, subject: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" placeholder="Subject..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Due Date</label>
                <input type="date" value={newAssignment.dueDate} onChange={(e) => setNewAssignment(p => ({ ...p, dueDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <textarea value={newAssignment.description} onChange={(e) => setNewAssignment(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none" placeholder="Assignment description..." />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreateAssignment(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button onClick={handleCreateAssignment} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
