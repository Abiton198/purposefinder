import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { timetableSlots, classes, teachers } from '@/data/mockData';
import { Calendar, Download, Filter } from 'lucide-react';

const TimetableModule: React.FC = () => {
  const { currentUser, selectedSchoolId } = useSchool();
  const [selectedClass, setSelectedClass] = useState('c1');

  const schoolId = currentUser?.role === 'director' ? selectedSchoolId : currentUser?.schoolId || 's1';
  const schoolClasses = classes.filter(c => !schoolId || c.schoolId === schoolId);
  const slots = timetableSlots.filter(t => t.classId === selectedClass);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
  const times = [
    { start: '08:00', end: '08:45' },
    { start: '08:50', end: '09:35' },
    { start: '09:40', end: '10:25' },
    { start: '10:40', end: '11:25' },
    { start: '11:30', end: '12:15' },
    { start: '13:00', end: '13:45' },
    { start: '13:50', end: '14:35' },
  ];

  const colors = [
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-blue-50 text-blue-700 border-blue-200',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
    'bg-amber-50 text-amber-700 border-amber-200',
    'bg-rose-50 text-rose-700 border-rose-200',
    'bg-cyan-50 text-cyan-700 border-cyan-200',
    'bg-indigo-50 text-indigo-700 border-indigo-200',
  ];

  const subjectColorMap: Record<string, string> = {};
  let colorIdx = 0;
  slots.forEach(s => {
    if (!subjectColorMap[s.subject]) {
      subjectColorMap[s.subject] = colors[colorIdx % colors.length];
      colorIdx++;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Timetable</h2>
          <p className="text-sm text-gray-500">Weekly class schedule</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            {schoolClasses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase w-24">Time</th>
              {days.map(day => (
                <th key={day} className="text-center py-3 px-2 text-xs font-medium text-gray-500 uppercase">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time, ti) => (
              <tr key={time.start} className="border-t border-gray-50">
                <td className="py-2 px-3">
                  <div className="text-sm font-medium text-gray-700">{time.start}</div>
                  <div className="text-xs text-gray-400">{time.end}</div>
                </td>
                {days.map(day => {
                  const slot = slots.find(s => s.day === day && s.startTime === time.start);
                  const teacher = slot ? teachers.find(t => t.id === slot.teacherId) : null;
                  return (
                    <td key={day} className="py-1 px-1">
                      {slot ? (
                        <div className={`p-3 rounded-xl border ${subjectColorMap[slot.subject] || colors[0]} transition-all hover:shadow-md cursor-pointer`}>
                          <div className="text-sm font-semibold">{slot.subject}</div>
                          <div className="text-xs opacity-70 mt-0.5">{teacher?.name?.split(' ')[0] || ''}</div>
                          <div className="text-[10px] opacity-60 mt-0.5">{slot.room}</div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-gray-50 text-center text-xs text-gray-300">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Subjects</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(subjectColorMap).map(([subject, color]) => (
            <span key={subject} className={`px-3 py-1 rounded-lg border text-xs font-medium ${color}`}>
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableModule;
