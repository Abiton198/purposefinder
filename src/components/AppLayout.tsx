import React from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LandingPage from '@/components/landing/LandingPage';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';
import DirectorDashboard from '@/components/dashboards/DirectorDashboard';
import PrincipalDashboard from '@/components/dashboards/PrincipalDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import ParentDashboard from '@/components/dashboards/ParentDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import StudentsModule from '@/components/modules/StudentsModule';
import TeachersModule from '@/components/modules/TeachersModule';
import AttendanceModule from '@/components/modules/AttendanceModule';
import GradesModule from '@/components/modules/GradesModule';
import AssignmentsModule from '@/components/modules/AssignmentsModule';
import TimetableModule from '@/components/modules/TimetableModule';
import FinanceModule from '@/components/modules/FinanceModule';
import MessagesModule from '@/components/modules/MessagesModule';
import AnnouncementsModule from '@/components/modules/AnnouncementsModule';
import EnrollmentModule from '@/components/modules/EnrollmentModule';
import ReportsModule from '@/components/modules/ReportsModule';
import SettingsModule from '@/components/modules/SettingsModule';
import { Loader2 } from 'lucide-react';

const AppLayout: React.FC = () => {
  const { isAuthenticated, currentUser, currentView, sidebarCollapsed } = useSchool();
  const { loading, profileLoading, session } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page when not authenticated
  if (!session) {
    return <LandingPage />;
  }

  // Show loading while profile is being fetched
  if (profileLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Render the correct dashboard based on role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'director': return <DirectorDashboard />;
      case 'principal': return <PrincipalDashboard />;
      case 'teacher': return <TeacherDashboard />;
      case 'parent': return <ParentDashboard />;
      case 'student': return <StudentDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <DirectorDashboard />;
    }
  };

  // Render the correct view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboard();
      case 'students': return <StudentsModule />;
      case 'teachers': return <TeachersModule />;
      case 'attendance': return <AttendanceModule />;
      case 'grades': return <GradesModule />;
      case 'assignments': return <AssignmentsModule />;
      case 'timetable': return <TimetableModule />;
      case 'finance': return <FinanceModule />;
      case 'messages': return <MessagesModule />;
      case 'announcements': return <AnnouncementsModule />;
      case 'enrollment': return <EnrollmentModule />;
      case 'reports': return <ReportsModule />;
      case 'settings': return <SettingsModule />;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <DashboardHeader />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-[68px]' : 'ml-64'}`}>
        <div className="p-6 max-w-[1400px]">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
