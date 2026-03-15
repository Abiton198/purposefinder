import React, { useState, useMemo } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import StatCard from '@/components/ui/StatCard';
import { invoices, payments, students, schools, revenueData, feeDistribution } from '@/data/mockData';
import {
  DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Search, Download,
  FileText, CreditCard, Filter
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const FinanceModule: React.FC = () => {
  const { currentUser, selectedSchoolId } = useSchool();
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const schoolId = currentUser?.role === 'director' ? selectedSchoolId : currentUser?.schoolId;
  const filteredInvoices = useMemo(() => {
    let result = schoolId ? invoices.filter(i => i.schoolId === schoolId) : invoices;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => {
        const student = students.find(s => s.id === i.studentId);
        return student?.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q);
      });
    }
    if (statusFilter !== 'all') result = result.filter(i => i.status === statusFilter);
    return result;
  }, [schoolId, searchQuery, statusFilter]);

  const filteredPayments = schoolId
    ? payments.filter(p => invoices.find(i => i.id === p.invoiceId)?.schoolId === schoolId)
    : payments;

  const totalRevenue = filteredInvoices.reduce((s, i) => s + i.paid, 0);
  const totalOutstanding = filteredInvoices.reduce((s, i) => s + i.balance, 0);
  const totalBilled = filteredInvoices.reduce((s, i) => s + i.total, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalRevenue / totalBilled) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Financial Management</h2>
          <p className="text-sm text-gray-500">Term 1 2026 Financial Overview</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Billed" value={`$${(totalBilled / 1000).toFixed(0)}K`} icon={FileText} iconColor="text-purple-600" iconBg="bg-purple-100" />
        <StatCard title="Collected" value={`$${(totalRevenue / 1000).toFixed(0)}K`} change={`${collectionRate}% rate`} changeType="positive" icon={DollarSign} iconColor="text-green-600" iconBg="bg-green-100" />
        <StatCard title="Outstanding" value={`$${(totalOutstanding / 1000).toFixed(0)}K`} change={`${filteredInvoices.filter(i => i.status === 'overdue').length} overdue`} changeType="negative" icon={AlertTriangle} iconColor="text-amber-600" iconBg="bg-amber-100" />
        <StatCard title="Payments" value={filteredPayments.length} icon={CreditCard} iconColor="text-blue-600" iconBg="bg-blue-100" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { id: 'overview' as const, label: 'Overview' },
          { id: 'invoices' as const, label: 'Invoices' },
          { id: 'payments' as const, label: 'Payments' },
        ].map(tab => (
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
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Revenue Trend</h3>
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
            <h3 className="font-semibold text-gray-900 mb-6">Fee Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={feeDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey="value" nameKey="name" label={({ name, value }) => `${name}: ${value}%`}>
                  {feeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Invoice</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Balance</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.slice(0, 20).map(inv => {
                    const student = students.find(s => s.id === inv.studentId);
                    return (
                      <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-mono text-gray-900">{inv.id.toUpperCase()}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{student?.name || 'Unknown'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{inv.term}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">${inv.total.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-green-600 text-right">${inv.paid.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-red-600 text-right font-medium">${inv.balance.toLocaleString()}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                            inv.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                            inv.status === 'overdue' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{inv.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Reference</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.slice(0, 20).map(pay => {
                  const student = students.find(s => s.id === pay.studentId);
                  return (
                    <tr key={pay.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-mono text-gray-900">{pay.reference}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{student?.name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{pay.date}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700 capitalize">{pay.method}</span>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600 text-right">${pay.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">{pay.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
