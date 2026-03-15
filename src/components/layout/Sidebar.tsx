import React from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import { ViewType } from '@/types/school';
import { IMAGES } from '@/data/mockData';
import {
  LayoutDashboard, Users, UserCheck, ClipboardCheck, BookOpen, FileText,
  Calendar, CreditCard, MessageSquare, Megaphone, UserPlus, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  icon: React.ElementType;
  label: string;
  view: ViewType;
  roles: string[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard', roles: ['director', 'principal', 'teacher', 'parent', 'student', 'admin'] },
  { icon: Users, label: 'Students', view: 'students', roles: ['director', 'principal', 'teacher', 'admin'] },
  { icon: UserCheck, label: 'Teachers', view: 'teachers', roles: ['director', 'principal', 'admin'] },
  { icon: ClipboardCheck, label: 'Attendance', view: 'attendance', roles: ['director', 'principal', 'teacher', 'parent', 'student'] },
  { icon: BookOpen, label: 'Grades', view: 'grades', roles: ['director', 'principal', 'teacher', 'parent', 'student'] },
  { icon: FileText, label: 'Assignments', view: 'assignments', roles: ['teacher', 'parent', 'student'] },
  { icon: Calendar, label: 'Timetable', view: 'timetable', roles: ['principal', 'teacher', 'student'] },
  { icon: CreditCard, label: 'Finance', view: 'finance', roles: ['director', 'principal', 'parent', 'admin'] },
  { icon: MessageSquare, label: 'Messages', view: 'messages', roles: ['director', 'principal', 'teacher', 'parent'] },
  { icon: Megaphone, label: 'Announcements', view: 'announcements', roles: ['director', 'principal', 'teacher', 'parent', 'student'] },
  { icon: UserPlus, label: 'Enrollment', view: 'enrollment', roles: ['director', 'principal', 'admin'] },
  { icon: BarChart3, label: 'Reports', view: 'reports', roles: ['director', 'principal'] },
  { icon: Settings, label: 'Settings', view: 'settings', roles: ['director', 'admin'] },
];

const Sidebar: React.FC = () => {
  const { currentUser, currentView, setCurrentView, sidebarCollapsed, toggleSidebar, logout } = useSchool();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const filteredItems = navItems.filter(item => item.roles.includes(currentUser.role));

  const roleColors: Record<string, string> = {
    director: 'from-purple-600 to-indigo-600',
    principal: 'from-blue-600 to-cyan-600',
    teacher: 'from-emerald-600 to-teal-600',
    parent: 'from-amber-600 to-orange-600',
    student: 'from-rose-600 to-pink-600',
    admin: 'from-slate-600 to-gray-600',
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-[68px]' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100 shrink-0">
        <img src={IMAGES.logo} alt="Logo" className="w-9 h-9 rounded-full shrink-0" />
        {!sidebarCollapsed && (
          <div className="ml-3 overflow-hidden">
            <div className="text-sm font-bold text-gray-900 truncate">Purpose Finder</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Academy</div>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className={`px-3 py-4 border-b border-gray-100 shrink-0 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
        {sidebarCollapsed ? (
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-r ${roleColors[currentUser.role]} flex items-center justify-center`}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-lg object-cover" />
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</div>
              <div className={`text-xs font-medium bg-gradient-to-r ${roleColors[currentUser.role]} bg-clip-text text-transparent capitalize`}>
                {currentUser.role}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {filteredItems.map(item => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-600' : ''}`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-100 p-2 shrink-0 space-y-0.5">
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
          title={sidebarCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5 shrink-0" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
