import React, { useState } from 'react';
import { schools, students, teachers, invoices, enrollmentTrends, attendanceTrends, revenueData, performanceBySchool } from '@/data/mockData';
import { Download, FileText, BarChart3, Users, DollarSign, ClipboardCheck } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsModule: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'enrollment' | 'attendance' | 'financial' | 'academic'>('enrollment');

  const reports = [
    { id: 'enrollment' as const, label: 'Enrollment', icon: Users, color: 'text-purple-600 bg-purple-100' },
    { id: 'attendance' as const, label: 'Attendance', icon: ClipboardCheck, color: 'text-blue-600 bg-blue-100' },
    { id: 'financial' as const, label: 'Financial', icon: DollarSign, color: 'text-green-600 bg-green-100' },
    { id: 'academic' as const, label: 'Academic', icon: BarChart3, color: 'text-amber-600 bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-500">Comprehensive institution reports</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {/* Report Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {reports.map(r => (
          <button
            key={r.id}
            onClick={() => setActiveReport(r.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              activeReport === r.id ? 'border-purple-300 bg-purple-50' : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${r.color} mb-2`}>
              <r.icon className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-gray-900">{r.label}</div>
            <div className="text-xs text-gray-500">Report</div>
          </button>
        ))}
      </div>

      {activeReport === 'enrollment' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Enrollment Trends by Campus</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="mainCampus" name="Main Campus" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="westCampus" name="West Campus" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="eastCampus" name="East Campus" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'attendance' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Attendance Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={attendanceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis domain={[88, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="rate" name="Attendance %" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'financial' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Revenue Collection</h3>
          <ResponsiveContainer width="100%" height={350}>
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
      )}

      {activeReport === 'academic' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Campus Academic Comparison</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={performanceBySchool}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="school" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Bar dataKey="average" name="Average" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              <Bar dataKey="highest" name="Highest" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="lowest" name="Lowest" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;
