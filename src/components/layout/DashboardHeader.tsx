import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { schools } from '@/data/mockData';
import { Search, Bell, Menu, ChevronDown } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  const { currentUser, currentView, selectedSchoolId, setSelectedSchoolId, toggleSidebar, sidebarCollapsed } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSchoolSelector, setShowSchoolSelector] = useState(false);

  if (!currentUser) return null;

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    students: 'Students',
    teachers: 'Teachers',
    attendance: 'Attendance',
    grades: 'Grades',
    assignments: 'Assignments',
    timetable: 'Timetable',
    finance: 'Finance',
    messages: 'Messages',
    announcements: 'Announcements',
    enrollment: 'Enrollment',
    reports: 'Reports',
    settings: 'Settings',
  };

  const notifications = [
    { id: 1, text: '3 new enrollment applications pending review', time: '5m ago', unread: true },
    { id: 2, text: 'Term 1 exam schedule published', time: '1h ago', unread: true },
    { id: 3, text: 'Fee payment received from Linda Williams', time: '2h ago', unread: false },
    { id: 4, text: 'Attendance alert: 5 students absent today', time: '3h ago', unread: false },
  ];

  const selectedSchool = schools.find(s => s.id === selectedSchoolId);

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-30 transition-all duration-300 ${sidebarCollapsed ? 'left-[68px]' : 'left-64'}`}>
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{viewTitles[currentView] || 'Dashboard'}</h1>
            <p className="text-xs text-gray-500">
              {currentUser.role === 'director' ? 'All Campuses' : selectedSchool?.name || 'Purpose Finder Academy'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64 border border-gray-200 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>

          {/* School Selector (Director only) */}
          {currentUser.role === 'director' && (
            <div className="relative">
              <button
                onClick={() => setShowSchoolSelector(!showSchoolSelector)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="hidden sm:inline">{selectedSchoolId ? schools.find(s => s.id === selectedSchoolId)?.name.split(' - ')[1] : 'All Campuses'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSchoolSelector && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSchoolSelector(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                    <button
                      onClick={() => { setSelectedSchoolId(null); setShowSchoolSelector(false); }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${!selectedSchoolId ? 'text-purple-600 font-medium' : 'text-gray-700'}`}
                    >
                      All Campuses
                    </button>
                    {schools.map(school => (
                      <button
                        key={school.id}
                        onClick={() => { setSelectedSchoolId(school.id); setShowSchoolSelector(false); }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${selectedSchoolId === school.id ? 'text-purple-600 font-medium' : 'text-gray-700'}`}
                      >
                        {school.name.split(' - ')[1] || school.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${n.unread ? 'bg-purple-50/50' : ''}`}>
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center">
                    <button className="text-sm text-purple-600 font-medium hover:text-purple-700">View All</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Avatar */}
          <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-lg object-cover border-2 border-gray-100" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
