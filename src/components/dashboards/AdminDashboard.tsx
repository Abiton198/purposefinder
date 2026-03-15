import React from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import StatCard from '@/components/ui/StatCard';
import { schools, students, teachers, invoices } from '@/data/mockData';
import { Users, GraduationCap, Building2, DollarSign, Settings, Shield, Database, Server } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { setCurrentView } = useSchool();

  const totalStudents = students.filter(s => s.status === 'active').length;
  const totalTeachers = teachers.length;
  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-600 to-gray-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <h2 className="text-2xl font-bold">System Administration</h2>
          <p className="text-gray-300 mt-1">Manage platform configuration and operations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={totalStudents} icon={Users} iconColor="text-purple-600" iconBg="bg-purple-100" />
        <StatCard title="Total Teachers" value={totalTeachers} icon={GraduationCap} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard title="Campuses" value={schools.length} icon={Building2} iconColor="text-emerald-600" iconBg="bg-emerald-100" />
        <StatCard title="Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} iconColor="text-green-600" iconBg="bg-green-100" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'User Management', desc: 'Manage accounts and roles', icon: Users, view: 'settings' as const, color: 'text-purple-600 bg-purple-100' },
          { label: 'Student Records', desc: 'View and manage student data', icon: GraduationCap, view: 'students' as const, color: 'text-blue-600 bg-blue-100' },
          { label: 'Financial Admin', desc: 'Invoices and payment management', icon: DollarSign, view: 'finance' as const, color: 'text-green-600 bg-green-100' },
          { label: 'Enrollment Admin', desc: 'Review enrollment applications', icon: Users, view: 'enrollment' as const, color: 'text-amber-600 bg-amber-100' },
          { label: 'System Settings', desc: 'Platform configuration', icon: Settings, view: 'settings' as const, color: 'text-slate-600 bg-slate-100' },
          { label: 'Security', desc: 'Access control and audit logs', icon: Shield, view: 'settings' as const, color: 'text-red-600 bg-red-100' },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => setCurrentView(item.view)}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all text-left group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color} mb-3 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900">{item.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="space-y-3">
          {[
            { label: 'Application Server', status: 'Operational', color: 'bg-green-500' },
            { label: 'Database', status: 'Operational', color: 'bg-green-500' },
            { label: 'File Storage', status: 'Operational', color: 'bg-green-500' },
            { label: 'Email Service', status: 'Operational', color: 'bg-green-500' },
            { label: 'Push Notifications', status: 'Operational', color: 'bg-green-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xs text-green-600 font-medium">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
