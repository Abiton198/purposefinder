import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import StatCard from '@/components/ui/StatCard';
import {
  schools, students, teachers, invoices, announcements,
  enrollmentTrends, attendanceTrends, revenueData, performanceBySchool, subjectPerformance
} from '@/data/mockData';
import {
  Users, GraduationCap, DollarSign, TrendingUp, AlertTriangle, CheckCircle2,
  Building2, BarChart3, ArrowUpRight
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const DirectorDashboard: React.FC = () => {
  const { setCurrentView, selectedSchoolId } = useSchool();
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'financial'>('overview');

  const filteredStudents = selectedSchoolId ? students.filter(s => s.schoolId === selectedSchoolId) : students;
  const filteredTeachers = selectedSchoolId ? teachers.filter(t => t.schoolId === selectedSchoolId) : teachers;
  const filteredInvoices = selectedSchoolId ? invoices.filter(i => i.schoolId === selectedSchoolId) : invoices;

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.paid, 0);
  const totalOutstanding = filteredInvoices.reduce((sum, inv) => sum + inv.balance, 0);
  const activeStudents = filteredStudents.filter(s => s.status === 'active').length;

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'academic' as const, label: 'Academic' },
    { id: 'financial' as const, label: 'Financial' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <h2 className="text-2xl font-bold">Good Morning, Dr. Mitchell</h2>
          <p className="text-purple-100 mt-1">Here's your institution overview for today, March 15, 2026</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={() => setCurrentView('enrollment')} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
              Review Applications
            </button>
            <button onClick={() => setCurrentView('reports')} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
              Generate Reports
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={activeStudents.toLocaleString()} change="+12 this month" changeType="positive" icon={Users} iconColor="text-purple-600" iconBg="bg-purple-100" />
        <StatCard title="Total Teachers" value={filteredTeachers.length} change="+2 new hires" changeType="positive" icon={GraduationCap} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard title="Revenue Collected" value={`$${(totalRevenue / 1000).toFixed(0)}K`} change="+8.2% vs last term" changeType="positive" icon={DollarSign} iconColor="text-green-600" iconBg="bg-green-100" />
        <StatCard title="Outstanding Fees" value={`$${(totalOutstanding / 1000).toFixed(0)}K`} change="15 overdue" changeType="negative" icon={AlertTriangle} iconColor="text-amber-600" iconBg="bg-amber-100" />
      </div>

      {/* Tab Navigation */}
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
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enrollment Trends */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Enrollment Trends</h3>
              <span className="text-xs text-gray-500">2025-2026 Academic Year</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={enrollmentTrends}>
                <defs>
                  <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="mainCampus" name="Main Campus" stroke="#7c3aed" fill="url(#colorMain)" strokeWidth={2} />
                <Area type="monotone" dataKey="westCampus" name="West Campus" stroke="#3b82f6" fill="url(#colorWest)" strokeWidth={2} />
                <Area type="monotone" dataKey="eastCampus" name="East Campus" stroke="#10b981" fill="url(#colorEast)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Trends */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Attendance Rate</h3>
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> 95.5% avg
              </span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={attendanceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis domain={[90, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="rate" name="Attendance %" stroke="#7c3aed" strokeWidth={3} dot={{ fill: '#7c3aed', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* School Comparison */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Campus Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={performanceBySchool}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="school" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="average" name="Average" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                <Bar dataKey="highest" name="Highest" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="lowest" name="Lowest" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Schools Overview */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Campus Overview</h3>
            <div className="space-y-4">
              {schools.map((school, i) => {
                const schoolStudents = students.filter(s => s.schoolId === school.id && s.status === 'active').length;
                const schoolTeachers = teachers.filter(t => t.schoolId === school.id).length;
                const schoolInvoices = invoices.filter(inv => inv.schoolId === school.id);
                const collected = schoolInvoices.reduce((s, inv) => s + inv.paid, 0);
                return (
                  <div key={school.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setCurrentView('students')}>
                    <img src={school.image} alt={school.name} className="w-16 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{school.name.split(' - ')[1] || school.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{schoolStudents} students, {schoolTeachers} teachers</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">${(collected / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-500">collected</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={subjectPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis type="category" dataKey="subject" tick={{ fontSize: 11 }} stroke="#9ca3af" width={80} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="average" name="Average Score" fill="#7c3aed" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Announcements</h3>
            <div className="space-y-3">
              {announcements.slice(0, 5).map(ann => (
                <div key={ann.id} className="p-3 rounded-lg border border-gray-100 hover:border-purple-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{ann.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ann.content}</p>
                    </div>
                    <span className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      ann.priority === 'high' ? 'bg-red-100 text-red-700' : ann.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>{ann.priority}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2">{ann.authorName} &middot; {ann.createdAt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'financial' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Revenue vs Outstanding</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${v/1000}K`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="outstanding" name="Outstanding" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-4">
              {[
                { label: 'Fully Paid', count: invoices.filter(i => i.status === 'paid').length, color: 'bg-green-500', pct: Math.round(invoices.filter(i => i.status === 'paid').length / invoices.length * 100) },
                { label: 'Partial Payment', count: invoices.filter(i => i.status === 'partial').length, color: 'bg-amber-500', pct: Math.round(invoices.filter(i => i.status === 'partial').length / invoices.length * 100) },
                { label: 'Unpaid', count: invoices.filter(i => i.status === 'unpaid').length, color: 'bg-red-400', pct: Math.round(invoices.filter(i => i.status === 'unpaid').length / invoices.length * 100) },
                { label: 'Overdue', count: invoices.filter(i => i.status === 'overdue').length, color: 'bg-red-600', pct: Math.round(invoices.filter(i => i.status === 'overdue').length / invoices.length * 100) },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.count} invoices ({item.pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-purple-50 rounded-xl">
              <div className="text-sm text-purple-700 font-medium">Total Revenue This Term</div>
              <div className="text-3xl font-bold text-purple-900 mt-1">${totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorDashboard;
