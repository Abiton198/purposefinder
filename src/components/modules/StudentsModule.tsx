import React, { useState, useMemo } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { students, schools } from '@/data/mockData';
import { Search, Filter, Download, Plus, ChevronDown, Eye, Edit, Mail } from 'lucide-react';

const StudentsModule: React.FC = () => {
  const { currentUser, selectedSchoolId } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'enrollment'>('name');

  const schoolId = currentUser?.role === 'director' ? selectedSchoolId : currentUser?.schoolId;

  const filteredStudents = useMemo(() => {
    let result = schoolId ? students.filter(s => s.schoolId === schoolId) : students;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }
    if (gradeFilter !== 'all') result = result.filter(s => s.grade === gradeFilter);
    if (statusFilter !== 'all') result = result.filter(s => s.status === statusFilter);
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'grade') return a.grade.localeCompare(b.grade);
      return a.enrollmentDate.localeCompare(b.enrollmentDate);
    });
    return result;
  }, [schoolId, searchQuery, gradeFilter, statusFilter, sortBy]);

  const uniqueGrades = [...new Set(students.map(s => s.grade))].sort();
  const student = selectedStudent ? students.find(s => s.id === selectedStudent) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Directory</h2>
          <p className="text-sm text-gray-500">{filteredStudents.length} students found</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
              />
            </div>
          </div>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="all">All Grades</option>
            {uniqueGrades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="name">Sort by Name</option>
            <option value="grade">Sort by Grade</option>
            <option value="enrollment">Sort by Enrollment</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">School</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Enrolled</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.slice(0, 25).map(s => {
                const school = schools.find(sc => sc.id === s.schoolId);
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{s.name}</div>
                          <div className="text-xs text-gray-500">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 font-mono">{s.id.toUpperCase()}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-700">{s.grade} {s.section}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{school?.name.split(' - ')[1] || ''}</span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-sm text-gray-600">{s.enrollmentDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>{s.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelectedStudent(s.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Email">
                          <Mail className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredStudents.length > 25 && (
          <div className="p-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">Showing 25 of {filteredStudents.length} students</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {student && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedStudent(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="flex items-center gap-4 mb-6">
              <img src={student.avatar} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.grade} &middot; Section {student.section}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Student ID', value: student.id.toUpperCase() },
                { label: 'Email', value: student.email },
                { label: 'Date of Birth', value: student.dateOfBirth },
                { label: 'Gender', value: student.gender },
                { label: 'Enrollment Date', value: student.enrollmentDate },
                { label: 'Status', value: student.status },
                { label: 'Emergency Contact', value: student.emergencyContact },
                { label: 'School', value: schools.find(sc => sc.id === student.schoolId)?.name.split(' - ')[1] || '' },
              ].map(item => (
                <div key={item.label} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-sm font-medium text-gray-900 capitalize mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsModule;
