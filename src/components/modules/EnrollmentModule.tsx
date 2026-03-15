import React, { useState } from 'react';
import { enrollmentApplications, schools } from '@/data/mockData';
import { useSchool } from '@/contexts/SchoolContext';
import { UserPlus, CheckCircle2, XCircle, Clock, FileText, Eye } from 'lucide-react';

const EnrollmentModule: React.FC = () => {
  const { currentUser, selectedSchoolId } = useSchool();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const schoolId = currentUser?.role === 'director' ? selectedSchoolId : currentUser?.schoolId;
  const apps = schoolId
    ? enrollmentApplications.filter(a => a.schoolId === schoolId)
    : enrollmentApplications;

  const filtered = statusFilter === 'all' ? apps : apps.filter(a => a.status === statusFilter);
  const app = selectedApp ? enrollmentApplications.find(a => a.id === selectedApp) : null;

  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    approved: apps.filter(a => a.status === 'approved').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Enrollment Applications</h2>
          <p className="text-sm text-gray-500">{stats.pending} pending review</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700">
          <option value="all">All ({stats.total})</option>
          <option value="pending">Pending ({stats.pending})</option>
          <option value="approved">Approved ({stats.approved})</option>
          <option value="rejected">Rejected ({stats.rejected})</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-center">
          <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-amber-900">{stats.pending}</div>
          <div className="text-xs text-amber-700">Pending</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-green-900">{stats.approved}</div>
          <div className="text-xs text-green-700">Approved</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-red-900">{stats.rejected}</div>
          <div className="text-xs text-red-700">Rejected</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filtered.map(application => {
          const school = schools.find(s => s.id === application.schoolId);
          return (
            <div key={application.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    application.status === 'approved' ? 'bg-green-100' :
                    application.status === 'rejected' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    <UserPlus className={`w-5 h-5 ${
                      application.status === 'approved' ? 'text-green-600' :
                      application.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{application.studentName}</h3>
                    <p className="text-sm text-gray-500">{application.grade} &middot; {school?.name.split(' - ')[1]}</p>
                    <p className="text-xs text-gray-400 mt-1">Parent: {application.parentName} &middot; {application.parentEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    application.status === 'approved' ? 'bg-green-100 text-green-700' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{application.status}</span>
                  <button onClick={() => setSelectedApp(application.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-gray-500">Applied: {application.submittedAt}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {application.documents.length} documents
                </span>
              </div>
              {application.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors">Approve</button>
                  <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors">Reject</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {app && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <button onClick={() => setSelectedApp(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Application Details</h3>
            <div className="space-y-3">
              {[
                { label: 'Student', value: app.studentName },
                { label: 'Grade', value: app.grade },
                { label: 'Parent', value: app.parentName },
                { label: 'Email', value: app.parentEmail },
                { label: 'Phone', value: app.parentPhone },
                { label: 'Applied', value: app.submittedAt },
                { label: 'Status', value: app.status },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{item.value}</span>
                </div>
              ))}
              <div>
                <span className="text-sm text-gray-500">Documents</span>
                <div className="mt-2 space-y-1">
                  {app.documents.map(doc => (
                    <div key={doc} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
              {app.notes && (
                <div className="p-3 bg-amber-50 rounded-lg">
                  <span className="text-xs text-amber-700 font-medium">Note: {app.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentModule;
