import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { assignments, students } from '@/data/mockData';
import { Search, Plus, Calendar, BookOpen, Clock, FileText, Upload } from 'lucide-react';

const AssignmentsModule: React.FC = () => {
  const { currentUser } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', subject: '', dueDate: '', description: '', maxScore: '100' });

  const schoolId = currentUser?.schoolId || 's1';
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';

  let filtered = assignments.filter(a => a.schoolId === schoolId);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q));
  }
  if (statusFilter !== 'all') filtered = filtered.filter(a => a.status === statusFilter);

  const handleCreate = () => {
    if (newAssignment.title) {
      setShowCreate(false);
      setNewAssignment({ title: '', subject: '', dueDate: '', description: '', maxScore: '100' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Assignments</h2>
          <p className="text-sm text-gray-500">{filtered.length} assignments</p>
        </div>
        {isTeacher && (
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Assignment
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search assignments..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>{a.status}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{a.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{a.subject}</p>
            <p className="text-xs text-gray-400 line-clamp-2 mb-3">{a.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {a.dueDate}</span>
              <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Max: {a.maxScore}</span>
            </div>
            {isStudent && a.status === 'active' && (
              <button className="mt-3 w-full px-3 py-2 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1">
                <Upload className="w-3 h-3" /> Submit Work
              </button>
            )}
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                <input type="text" value={newAssignment.title} onChange={(e) => setNewAssignment(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
                  <input type="text" value={newAssignment.subject} onChange={(e) => setNewAssignment(p => ({ ...p, subject: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Due Date</label>
                  <input type="date" value={newAssignment.dueDate} onChange={(e) => setNewAssignment(p => ({ ...p, dueDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Max Score</label>
                <input type="number" value={newAssignment.maxScore} onChange={(e) => setNewAssignment(p => ({ ...p, maxScore: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <textarea value={newAssignment.description} onChange={(e) => setNewAssignment(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none" />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsModule;
