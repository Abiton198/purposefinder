import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import StatCard from '@/components/ui/StatCard';
import { students, assignments, grades, timetableSlots, announcements } from '@/data/mockData';
import {
  BookOpen, Calendar, ClipboardCheck, TrendingUp, FileText, Upload,
  Clock, CheckCircle2, AlertCircle, Megaphone
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentDashboard: React.FC = () => {
  const { setCurrentView } = useSchool();
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'timetable' | 'grades'>('overview');
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  const student = students[0];
  const myGrades = grades.filter(g => g.studentId === student.id);
  const myAssignments = assignments.filter(a => a.schoolId === student.schoolId).slice(0, 8);
  const myTimetable = timetableSlots.filter(t => t.schoolId === student.schoolId).slice(0, 35);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
  const times = ['08:00', '08:50', '09:40', '10:40', '11:30', '13:00', '13:50'];

  const gradeData = myGrades.length > 0 ? myGrades[0].assignmentScores : [
    { name: 'HW 1', score: 85, maxScore: 100 },
    { name: 'HW 2', score: 78, maxScore: 100 },
    { name: 'HW 3', score: 92, maxScore: 100 },
  ];

  const handleSubmit = () => {
    if (submissionText) {
      setSelectedAssignment(null);
      setSubmissionText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <img src={student.avatar} alt={student.name} className="w-14 h-14 rounded-xl object-cover border-2 border-white/30" />
          <div>
            <h2 className="text-2xl font-bold">Hi, {student.name.split(' ')[0]}!</h2>
            <p className="text-rose-100">{student.grade} &middot; Section {student.section}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Assignments" value={myAssignments.filter(a => a.status === 'active').length} icon={FileText} iconColor="text-rose-600" iconBg="bg-rose-100" />
        <StatCard title="Average Grade" value={myGrades[0]?.grade || 'B+'} icon={TrendingUp} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard title="Attendance" value="93%" icon={ClipboardCheck} iconColor="text-green-600" iconBg="bg-green-100" />
        <StatCard title="Classes Today" value={7} icon={Calendar} iconColor="text-purple-600" iconBg="bg-purple-100" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit overflow-x-auto">
        {[
          { id: 'overview' as const, label: 'Overview' },
          { id: 'assignments' as const, label: 'Assignments' },
          { id: 'timetable' as const, label: 'Timetable' },
          { id: 'grades' as const, label: 'My Grades' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Classes */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Today's Classes</h3>
            <div className="space-y-2">
              {myTimetable.filter(t => t.day === 'Monday').slice(0, 7).map((slot, i) => (
                <div key={slot.id} className={`flex items-center gap-4 p-3 rounded-lg ${i === 0 ? 'bg-rose-50 border border-rose-200' : 'bg-gray-50'}`}>
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-semibold text-gray-900">{slot.startTime}</div>
                    <div className="text-xs text-gray-500">{slot.endTime}</div>
                  </div>
                  <div className="w-0.5 h-10 bg-rose-300 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{slot.subject}</div>
                    <div className="text-xs text-gray-500">{slot.room}</div>
                  </div>
                  {i === 0 && <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">Now</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Due */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Due Soon</h3>
              <div className="space-y-3">
                {myAssignments.filter(a => a.status === 'active').slice(0, 4).map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{a.title}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {a.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Announcements</h3>
              <div className="space-y-3">
                {announcements.filter(a => a.targetRoles.includes('student')).slice(0, 3).map(ann => (
                  <div key={ann.id} className="p-3 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-2">
                      <Megaphone className={`w-4 h-4 shrink-0 mt-0.5 ${ann.priority === 'high' ? 'text-red-500' : 'text-gray-400'}`} />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{ann.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ann.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {myAssignments.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{a.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{a.subject}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>{a.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{a.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {a.dueDate}</span>
                  {a.status === 'active' && (
                    <button
                      onClick={() => setSelectedAssignment(a.id)}
                      className="px-3 py-1 bg-rose-500 text-white text-xs font-medium rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" /> Submit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-6">Weekly Timetable</h3>
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase w-20">Time</th>
                {days.map(day => (
                  <th key={day} className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time, ti) => (
                <tr key={time} className="border-t border-gray-50">
                  <td className="py-2 px-3 text-xs font-medium text-gray-500">{time}</td>
                  {days.map(day => {
                    const slot = myTimetable.find(t => t.day === day && t.startTime === time);
                    const colors = ['bg-purple-50 text-purple-700 border-purple-200', 'bg-blue-50 text-blue-700 border-blue-200', 'bg-emerald-50 text-emerald-700 border-emerald-200', 'bg-amber-50 text-amber-700 border-amber-200', 'bg-rose-50 text-rose-700 border-rose-200'];
                    return (
                      <td key={day} className="py-1 px-1">
                        {slot && (
                          <div className={`p-2 rounded-lg border text-center ${colors[ti % colors.length]}`}>
                            <div className="text-xs font-medium">{slot.subject}</div>
                            <div className="text-[10px] opacity-70">{slot.room}</div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'grades' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">My Scores</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="score" name="Score" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Score Details</h3>
            <div className="space-y-3">
              {gradeData.map((item, i) => {
                const pct = Math.round((item.score / item.maxScore) * 100);
                return (
                  <div key={i} className="p-3 rounded-lg bg-gray-50">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.score}/{item.maxScore}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {myGrades[0] && (
              <div className="mt-6 p-4 bg-rose-50 rounded-xl text-center">
                <div className="text-sm text-rose-600">Overall Average</div>
                <div className="text-3xl font-bold text-rose-700 mt-1">{myGrades[0].average}%</div>
                <div className="text-lg font-bold text-rose-800">{myGrades[0].grade}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedAssignment(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Submit Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Your Work</label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
                  placeholder="Paste your work or describe your submission..."
                />
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-rose-300 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload files or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX, images up to 10MB</p>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setSelectedAssignment(null)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-colors">Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
