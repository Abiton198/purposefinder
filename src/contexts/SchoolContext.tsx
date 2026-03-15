import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole, ViewType, AttendanceRecord } from '@/types/school';
import { demoUsers, attendanceRecords as initialAttendance } from '@/data/mockData';
import { useAuth, UserProfile } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface SchoolContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  currentView: ViewType;
  selectedSchoolId: string | null;
  sidebarCollapsed: boolean;
  attendanceRecords: AttendanceRecord[];
  logout: () => void;
  setCurrentView: (view: ViewType) => void;
  setSelectedSchoolId: (id: string | null) => void;
  toggleSidebar: () => void;
  markAttendance: (records: AttendanceRecord[]) => void;
}

const SchoolContext = createContext<SchoolContextType>({} as SchoolContextType);

export const useSchool = () => useContext(SchoolContext);

// Convert a Supabase UserProfile into the app's User type
function profileToUser(profile: UserProfile): User {
  return {
    id: profile.id,
    name: profile.name || 'User',
    email: profile.email,
    role: profile.role as UserRole,
    avatar: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'U')}&background=7c3aed&color=fff&size=128`,
    schoolId: profile.school_id || undefined,
    phone: profile.phone || undefined,
  };
}

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, user, signOut, session } = useAuth();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(initialAttendance);

  // Sync auth profile → currentUser
  useEffect(() => {
    if (profile) {
      const appUser = profileToUser(profile);
      setCurrentUser(appUser);
      if (appUser.schoolId) {
        setSelectedSchoolId(appUser.schoolId);
      }
      // Make sure we're on the dashboard when user logs in
      setCurrentView('dashboard');
    } else if (!session) {
      setCurrentUser(null);
      setCurrentView('landing');
      setSelectedSchoolId(null);
    }
  }, [profile, session]);

  const isAuthenticated = !!session && !!currentUser;

  const logout = useCallback(async () => {
    await signOut();
    setCurrentUser(null);
    setCurrentView('landing');
    setSelectedSchoolId(null);
  }, [signOut]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const markAttendance = useCallback((records: AttendanceRecord[]) => {
    setAttendanceData(prev => {
      const newRecords = [...prev];
      records.forEach(record => {
        const existingIdx = newRecords.findIndex(
          r => r.studentId === record.studentId && r.date === record.date
        );
        if (existingIdx >= 0) {
          newRecords[existingIdx] = record;
        } else {
          newRecords.push(record);
        }
      });
      return newRecords;
    });
    toast({ title: 'Attendance Saved', description: `${records.length} records updated successfully.` });
  }, []);

  return (
    <SchoolContext.Provider value={{
      currentUser,
      isAuthenticated,
      currentView,
      selectedSchoolId,
      sidebarCollapsed,
      attendanceRecords: attendanceData,
      logout,
      setCurrentView,
      setSelectedSchoolId,
      toggleSidebar,
      markAttendance,
    }}>
      {children}
    </SchoolContext.Provider>
  );
};
