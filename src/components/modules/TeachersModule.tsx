import React, { useState, useMemo } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { teachers, schools } from '@/data/mockData';
import { Search, Plus, Download, Mail, Phone, BookOpen, Eye } from 'lucide-react';

const TeachersModule: React.FC = () => {
  const { currentUser, selectedSchoolId } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const schoolId = currentUser?.role === 'director' ? selectedSchoolId : currentUser?.schoolId;

  const filteredTeachers = useMemo(() => {
    let result = schoolId ? teachers.filter(t => t.schoolId === schoolId) : teachers;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.subjects.some(s => s.toLowerCase().includes(q)));
    }
    return result;
  }, [schoolId, searchQuery]);

  const teacher = selectedTeacher ? teachers.find(t => t.id === selectedTeacher) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Teacher Directory</h2>
          <p className="text-sm text-gray-500">{filteredTeachers.length} teachers</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Teacher
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or subject..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map(t => {
          const school = schools.find(s => s.id === t.schoolId);
          return (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{t.name}</h3>
                  <p className="text-xs text-gray-500">{t.qualification}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{school?.name.split(' - ')[1]}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.subjects.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[11px] font-medium">{s}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => setSelectedTeacher(t.id)} className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" /> View
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Mail className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {teacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTeacher(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <button onClick={() => setSelectedTeacher(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="flex items-center gap-4 mb-6">
              <img src={teacher.avatar} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                <p className="text-sm text-gray-500">{teacher.qualification}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email', value: teacher.email },
                { label: 'Phone', value: teacher.phone },
                { label: 'Joined', value: teacher.joinDate },
                { label: 'School', value: schools.find(s => s.id === teacher.schoolId)?.name.split(' - ')[1] || '' },
              ].map(item => (
                <div key={item.label} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-sm font-medium text-gray-900 mt-0.5 truncate">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-2">Subjects</div>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map(s => (
                  <span key={s} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-2">Classes</div>
              <div className="flex flex-wrap gap-2">
                {teacher.classes.map(c => (
                  <span key={c} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersModule;
