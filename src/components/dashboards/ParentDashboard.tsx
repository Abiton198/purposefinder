import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import StatCard from '@/components/ui/StatCard';
import { students, grades, invoices, announcements, assignments, messages } from '@/data/mockData';
import {
  User, BookOpen, CreditCard, Megaphone, Calendar, MessageSquare,
  CheckCircle2, Clock, AlertCircle, DollarSign, TrendingUp, FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ParentDashboard: React.FC = () => {
  const { currentUser, setCurrentView } = useSchool();
  const [activeTab, setActiveTab] = useState<'overview' | 'grades' | 'fees' | 'messages'>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  // Parent's child
  const child = students.find(s => s.id === 'st1') || students[0];
  const childGrades = grades.filter(g => g.studentId === child.id);
  const childInvoices = invoices.filter(i => i.studentId === child.id);
  const childAssignments = assignments.filter(a => a.schoolId === child.schoolId).slice(0, 5);
  const parentMessages = messages.filter(m => m.senderId === 'u5' || m.receiverId === 'u5');

  const gradeData = childGrades.length > 0 ? childGrades[0].assignmentScores.concat(
    childGrades[0].testScores.map(t => ({ name: t.name, score: t.score, maxScore: t.maxScore }))
  ) : [
    { name: 'HW 1', score: 85, maxScore: 100 },
    { name: 'HW 2', score: 78, maxScore: 100 },
    { name: 'Test 1', score: 42, maxScore: 50 },
    { name: 'Test 2', score: 38, maxScore: 50 },
  ];

  const totalOwed = childInvoices.reduce((s, i) => s + i.balance, 0);
  const totalPaid = childInvoices.reduce((s, i) => s + i.paid, 0);

  const handlePayment = () => {
    setShowPaymentModal(false);
    setSelectedInvoice(null);
  };

  const attendanceSummary = { present: 12, absent: 1, late: 1, total: 14 };
  const attendanceRate = Math.round((attendanceSummary.present / attendanceSummary.total) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <img src={child.avatar} alt={child.name} className="w-16 h-16 rounded-xl object-cover border-2 border-white/30" />
          <div>
            <h2 className="text-2xl font-bold">{child.name}</h2>
            <p className="text-amber-100">{child.grade} &middot; Section {child.section} &middot; ID: {child.id.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance Rate" value={`${attendanceRate}%`} change={`${attendanceSummary.absent} absent`} changeType={attendanceSummary.absent > 2 ? 'negative' : 'neutral'} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-100" />
        <StatCard title="Overall Grade" value={childGrades[0]?.grade || 'B+'} icon={TrendingUp} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard title="Fees Paid" value={`$${totalPaid.toLocaleString()}`} icon={DollarSign} iconColor="text-emerald-600" iconBg="bg-emerald-100" />
        <StatCard title="Balance Due" value={`$${totalOwed.toLocaleString()}`} change={totalOwed > 0 ? 'Payment due' : 'All clear'} changeType={totalOwed > 0 ? 'negative' : 'positive'} icon={CreditCard} iconColor="text-amber-600" iconBg="bg-amber-100" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit overflow-x-auto">
        {[
          { id: 'overview' as const, label: 'Overview' },
          { id: 'grades' as const, label: 'Grades' },
          { id: 'fees' as const, label: 'Fees & Payments' },
          { id: 'messages' as const, label: 'Messages' },
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
          {/* Attendance Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">This Week's Attendance</h3>
            <div className="grid grid-cols-5 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => {
                const status = i < 3 ? 'present' : i === 3 ? 'late' : 'present';
                return (
                  <div key={day} className={`p-4 rounded-xl text-center ${
                    status === 'present' ? 'bg-green-50 border border-green-200' :
                    status === 'late' ? 'bg-amber-50 border border-amber-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <div className="text-xs text-gray-500 mb-2">{day}</div>
                    <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                      status === 'present' ? 'bg-green-500' : status === 'late' ? 'bg-amber-500' : 'bg-red-500'
                    }`}>
                      {status === 'present' ? <CheckCircle2 className="w-4 h-4 text-white" /> :
                       status === 'late' ? <Clock className="w-4 h-4 text-white" /> :
                       <AlertCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="text-xs font-medium mt-2 capitalize text-gray-700">{status}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Announcements</h3>
            <div className="space-y-3">
              {announcements.filter(a => a.targetRoles.includes('parent')).slice(0, 4).map(ann => (
                <div key={ann.id} className="p-3 rounded-lg border border-gray-100">
                  <div className="flex items-start gap-2">
                    <Megaphone className={`w-4 h-4 shrink-0 mt-0.5 ${ann.priority === 'high' ? 'text-red-500' : 'text-gray-400'}`} />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{ann.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ann.content}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{ann.createdAt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
            <div className="space-y-2">
              {childAssignments.map(a => (
                <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{a.title}</div>
                    <div className="text-xs text-gray-500">{a.subject}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-500">Due</div>
                    <div className="text-sm font-medium text-gray-900">{a.dueDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Pay */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Fee Summary</h3>
            {childInvoices.length > 0 && (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="text-sm text-amber-700">Outstanding Balance</div>
                  <div className="text-3xl font-bold text-amber-900 mt-1">${totalOwed.toLocaleString()}</div>
                </div>
                {totalOwed > 0 && (
                  <button
                    onClick={() => { setSelectedInvoice(childInvoices[0].id); setShowPaymentModal(true); }}
                    className="w-full px-4 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'grades' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Score Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="score" name="Score" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Grade Details</h3>
            <div className="space-y-3">
              {gradeData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(item.score / item.maxScore) * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-16 text-right">{item.score}/{item.maxScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Invoices & Payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Invoice</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Term</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {childInvoices.map(inv => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{inv.id.toUpperCase()}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{inv.term}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">${inv.total.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-green-600 text-right">${inv.paid.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-red-600 text-right font-medium">${inv.balance.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                        inv.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>{inv.status}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.balance > 0 && (
                        <button
                          onClick={() => { setSelectedInvoice(inv.id); setShowPaymentModal(true); }}
                          className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Messages</h3>
          <div className="space-y-3">
            {parentMessages.map(msg => (
              <div key={msg.id} className={`p-4 rounded-lg border ${!msg.read && msg.receiverId === 'u5' ? 'border-amber-200 bg-amber-50/50' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{msg.subject}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{msg.senderId === 'u5' ? `To: ${msg.receiverName}` : `From: ${msg.senderName}`}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Make Payment</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500">Amount Due</div>
                <div className="text-2xl font-bold text-gray-900">${totalOwed.toLocaleString()}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Card Number</label>
                <input type="text" placeholder="4242 4242 4242 4242" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">CVC</label>
                  <input type="text" placeholder="123" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button onClick={handlePayment} className="px-6 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">Pay ${totalOwed.toLocaleString()}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
