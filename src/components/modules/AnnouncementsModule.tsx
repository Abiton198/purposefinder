import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { announcements, schools } from '@/data/mockData';
import { Megaphone, Plus, Filter, AlertCircle, Info, Bell } from 'lucide-react';

const AnnouncementsModule: React.FC = () => {
  const { currentUser } = useSchool();
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: '', content: '', priority: 'medium' as string });

  const canCreate = currentUser?.role === 'director' || currentUser?.role === 'principal';

  const filtered = priorityFilter === 'all'
    ? announcements
    : announcements.filter(a => a.priority === priorityFilter);

  const handleCreate = () => {
    if (newAnn.title && newAnn.content) {
      setShowCreate(false);
      setNewAnn({ title: '', content: '', priority: 'medium' });
    }
  };

  const priorityIcon = (p: string) => {
    if (p === 'high') return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (p === 'medium') return <Bell className="w-4 h-4 text-amber-500" />;
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
          <p className="text-sm text-gray-500">{filtered.length} announcements</p>
        </div>
        <div className="flex gap-2">
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700">
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {canCreate && (
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Announcement
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(ann => {
          const school = ann.schoolId === 'all' ? null : schools.find(s => s.id === ann.schoolId);
          return (
            <div key={ann.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  ann.priority === 'high' ? 'bg-red-100' : ann.priority === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  {priorityIcon(ann.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        ann.priority === 'high' ? 'bg-red-100 text-red-700' :
                        ann.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{ann.priority}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{ann.content}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                    <span>{ann.authorName}</span>
                    <span>&middot;</span>
                    <span>{ann.createdAt}</span>
                    <span>&middot;</span>
                    <span>{school ? school.name.split(' - ')[1] : 'All Campuses'}</span>
                    <span>&middot;</span>
                    <div className="flex gap-1">
                      {ann.targetRoles.map(r => (
                        <span key={r} className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] capitalize">{r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">New Announcement</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                <input type="text" value={newAnn.title} onChange={(e) => setNewAnn(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Priority</label>
                <select value={newAnn.priority} onChange={(e) => setNewAnn(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Content</label>
                <textarea value={newAnn.content} onChange={(e) => setNewAnn(p => ({ ...p, content: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none" />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsModule;
