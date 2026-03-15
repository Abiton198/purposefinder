import React, { useState, useMemo } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { grades, students, schools, subjectPerformance } from '@/data/mockData';
import { Search, Download, TrendingUp, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GradesModule: React.FC = () => {
  const { currentUser, selectedSchoolId } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [termFilter, setTermFilter] = useState('all');

  const schoolId = currentUser?.role === 'director' ? selectedSchoolId : currentUser?.schoolId;

  const filteredGrades = useMemo(() => {
    let result = grades;
    if (schoolId) {
      const schoolStudentIds = students.filter(s => s.schoolId === schoolId).map(s => s.id);
      result = result.filter(g => schoolStudentIds.includes(g.studentId));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => {
        const student = students.find(s => s.id === g.studentId);
        return student?.name.toLowerCase().includes(q) || g.subject.toLowerCase().includes(q);
      });
    }
    if (termFilter !== 'all') result = result.filter(g => g.term === termFilter);
    return result;
  }, [schoolId, searchQuery, termFilter]);

  const avgScore = filteredGrades.length > 0
    ? Math.round(filteredGrades.reduce((s, g) => s + g.average, 0) / filteredGrades.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Academic Grades</h2>
          <p className="text-sm text-gray-500">{filteredGrades.length} grade records</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report Cards
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white">
          <TrendingUp className="w-8 h-8 text-white/60 mb-2" />
          <div className="text-3xl font-bold">{avgScore}%</div>
          <div className="text-sm text-purple-200">Average Score</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <BookOpen className="w-8 h-8 text-green-500 mb-2" />
          <div className="text-3xl font-bold text-gray-900">{filteredGrades.filter(g => g.average >= 80).length}</div>
          <div className="text-sm text-gray-500">Honor Roll (80%+)</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <BookOpen className="w-8 h-8 text-amber-500 mb-2" />
          <div className="text-3xl font-bold text-gray-900">{filteredGrades.filter(g => g.average < 60).length}</div>
          <div className="text-sm text-gray-500">Needs Improvement (&lt;60%)</div>
        </div>
      </div>

      {/* Subject Performance Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Subject Performance Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="subject" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="average" name="Average" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by student or subject..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
        </div>
        <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700">
          <option value="all">All Terms</option>
          <option value="Term 1 2026">Term 1 2026</option>
        </select>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Term</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Average</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.slice(0, 20).map(g => {
                const student = students.find(s => s.id === g.studentId);
                const gradeColor = g.average >= 80 ? 'text-green-600 bg-green-50' : g.average >= 70 ? 'text-blue-600 bg-blue-50' : g.average >= 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
                return (
                  <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={student?.avatar || ''} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium text-gray-900">{student?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{g.subject}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{g.term}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${g.average >= 80 ? 'bg-green-500' : g.average >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${g.average}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{g.average}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${gradeColor}`}>{g.grade}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <TrendingUp className={`w-4 h-4 mx-auto ${g.average >= 75 ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradesModule;
