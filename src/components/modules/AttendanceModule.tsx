import React, { useState, useMemo } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { students, schools } from '@/data/mockData';
import { Search, Calendar, CheckCircle2, XCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AttendanceModule: React.FC = () => {
  const { currentUser, selectedSchoolId, attendanceRecords } = useSchool();
  const [selectedDate, setSelectedDate] = useState('2026-03-14');
  const [searchQuery, setSearchQuery] = useState('');

  const schoolId = currentUser?.role === 'director' ? selectedSchoolId : currentUser?.schoolId;
  const schoolStudents = schoolId ? students.filter(s => s.schoolId === schoolId) : students;

  const dateRecords = useMemo(() => {
    return attendanceRecords.filter(r => r.date === selectedDate);
  }, [attendanceRecords, selectedDate]);

  const filteredRecords = useMemo(() => {
    let records = dateRecords;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      records = records.filter(r => {
        const student = students.find(s => s.id === r.studentId);
        return student?.name.toLowerCase().includes(q);
      });
    }
    return records;
  }, [dateRecords, searchQuery]);

  const stats = {
    present: dateRecords.filter(r => r.status === 'present').length,
    absent: dateRecords.filter(r => r.status === 'absent').length,
    late: dateRecords.filter(r => r.status === 'late').length,
    total: dateRecords.length,
  };

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const day = `2026-03-${String(8 + i).padStart(2, '0')}`;
    const dayRecords = attendanceRecords.filter(r => r.date === day);
    const present = dayRecords.filter(r => r.status === 'present').length;
    const total = dayRecords.length || 1;
    return { day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], rate: Math.round((present / total) * 100) };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Attendance Management</h2>
          <p className="text-sm text-gray-500">Track and monitor student attendance</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.present}</div>
              <div className="text-xs text-gray-500">Present</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.absent}</div>
              <div className="text-xs text-gray-500">Absent</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.late}</div>
              <div className="text-xs text-gray-500">Late</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%</div>
              <div className="text-xs text-gray-500">Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Weekly Attendance Rate</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="rate" name="Rate %" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Records Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Attendance Records - {selectedDate}</h3>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
            </div>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.slice(0, 30).map(record => {
                  const student = students.find(s => s.id === record.studentId);
                  if (!student) return null;
                  return (
                    <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <img src={student.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <span className="text-sm text-gray-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">{student.grade}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          record.status === 'present' ? 'bg-green-100 text-green-700' :
                          record.status === 'absent' ? 'bg-red-100 text-red-700' :
                          record.status === 'late' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {record.status === 'present' && <CheckCircle2 className="w-3 h-3" />}
                          {record.status === 'absent' && <XCircle className="w-3 h-3" />}
                          {record.status === 'late' && <Clock className="w-3 h-3" />}
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModule;
