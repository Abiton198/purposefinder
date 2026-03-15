import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import StatCard from '@/components/ui/StatCard';
import { schools, students, teachers, invoices, announcements, attendanceTrends, enrollmentApplications } from '@/data/mockData';
import {
  Users, GraduationCap, DollarSign, ClipboardCheck, TrendingUp, UserPlus,
  Megaphone, Calendar, ArrowUpRight, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PrincipalDashboard: React.FC = () => {
  const { currentUser, setCurrentView, selectedSchoolId } = useSchool();
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');

  const schoolId = selectedSchoolId || currentUser?.schoolId || 's1';
  const school = schools.find(s => s.id === schoolId);
  const schoolStudents = students.filter(s => s.schoolId === schoolId);
  const schoolTeachers = teachers.filter(t => t.schoolId === schoolId);
  const schoolInvoices = invoices.filter(i => i.schoolId === schoolId);
  const schoolApplications = enrollmentApplications.filter(a => a.schoolId === schoolId);
  const activeStudents = schoolStudents.filter(s => s.status === 'active').length;
  const revenue = schoolInvoices.reduce((s, i) => s + i.paid, 0);
  const outstanding = schoolInvoices.reduce((s, i) => s + i.balance, 0);

  const gradeDistribution = [6, 7, 8, 9, 10, 11, 12].map(g => ({
    grade: `G${g}`,
    count: schoolStudents.filter(s => s.grade === `Grade ${g}`).length,
  }));

  const handlePostAnnouncement = () => {
    if (announcementTitle && announcementContent) {
      setShowAnnouncementForm(false);
      setAnnouncementTitle('');
      setAnnouncementContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <h2 className="text-2xl font-bold">Welcome, {currentUser?.name?.split(' ')[0]}</h2>
          <p className="text-blue-100 mt-1">{school?.name} &middot; March 15, 2026</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={() => setShowAnnouncementForm(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
              Post Announcement
            </button>
            <button onClick={() => setCurrentView('students')} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
              View Students
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Students" value={activeStudents} change="+5 this month" changeType="positive" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard title="Teachers" value={schoolTeachers.length} icon={GraduationCap} iconColor="text-emerald-600" iconBg="bg-emerald-100" />
        <StatCard title="Revenue" value={`$${(revenue / 1000).toFixed(0)}K`} change="+12%" changeType="positive" icon={DollarSign} iconColor="text-green-600" iconBg="bg-green-100" />
        <StatCard title="Pending Apps" value={schoolApplications.filter(a => a.status === 'pending').length} icon={UserPlus} iconColor="text-amber-600" iconBg="bg-amber-100" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Weekly Attendance</h3>
            <button onClick={() => setCurrentView('attendance')} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View Details <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis domain={[90, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Manage Students', icon: Users, view: 'students' as const, color: 'text-blue-600 bg-blue-50' },
              { label: 'View Attendance', icon: ClipboardCheck, view: 'attendance' as const, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Academic Grades', icon: TrendingUp, view: 'grades' as const, color: 'text-purple-600 bg-purple-50' },
              { label: 'Timetable', icon: Calendar, view: 'timetable' as const, color: 'text-amber-600 bg-amber-50' },
              { label: 'Announcements', icon: Megaphone, view: 'announcements' as const, color: 'text-rose-600 bg-rose-50' },
              { label: 'Enrollment', icon: UserPlus, view: 'enrollment' as const, color: 'text-cyan-600 bg-cyan-50' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => setCurrentView(action.view)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Student Distribution by Grade</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="grade" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" name="Students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Enrollment Applications</h3>
            <button onClick={() => setCurrentView('enrollment')} className="text-sm text-blue-600 font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {schoolApplications.map(app => (
              <div key={app.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  app.status === 'approved' ? 'bg-green-100' : app.status === 'rejected' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  {app.status === 'approved' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                   app.status === 'rejected' ? <AlertCircle className="w-4 h-4 text-red-600" /> :
                   <Clock className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{app.studentName}</div>
                  <div className="text-xs text-gray-500">{app.grade} &middot; Applied {app.submittedAt}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  app.status === 'approved' ? 'bg-green-100 text-green-700' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcement Form Modal */}
      {showAnnouncementForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAnnouncementForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Post Announcement</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="Announcement title..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Content</label>
                <textarea
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
                  placeholder="Write your announcement..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowAnnouncementForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
                <button onClick={handlePostAnnouncement} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalDashboard;
