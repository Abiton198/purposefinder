import React, { useState } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { schools, IMAGES } from '@/data/mockData';
import { Building2, Users, Bell, Shield, Palette, Globe, Save } from 'lucide-react';

const SettingsModule: React.FC = () => {
  const { currentUser } = useSchool();
  const [activeSection, setActiveSection] = useState('institution');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: 'institution', label: 'Institution', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 h-fit">
          <div className="space-y-0.5">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeSection === s.id ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6">
          {activeSection === 'institution' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Institution Settings</h3>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img src={IMAGES.logo} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <button className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors">Change Logo</button>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Institution Name</label>
                  <input type="text" defaultValue="Purpose Finder Academy" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Contact Email</label>
                  <input type="email" defaultValue="admin@purposefinder.edu" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
                  <input type="text" defaultValue="+1-555-0100" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Website</label>
                  <input type="text" defaultValue="www.purposefinder.edu" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
                <textarea defaultValue="123 Education Blvd, Springfield, IL" rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mt-4">Campuses</h4>
              <div className="space-y-2">
                {schools.map(school => (
                  <div key={school.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img src={school.image} alt="" className="w-10 h-8 rounded object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{school.name}</div>
                      <div className="text-xs text-gray-500">{school.address}</div>
                    </div>
                    <button className="text-xs text-purple-600 font-medium hover:text-purple-700">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
              {[
                { label: 'Absence Alerts', desc: 'Notify parents when student is marked absent' },
                { label: 'Assignment Reminders', desc: 'Send reminders before assignment due dates' },
                { label: 'Payment Reminders', desc: 'Notify parents about upcoming fee deadlines' },
                { label: 'Announcement Notifications', desc: 'Push notifications for new announcements' },
                { label: 'Grade Updates', desc: 'Notify when new grades are posted' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">All security measures are active</span>
                </div>
              </div>
              {[
                { label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin accounts', enabled: true },
                { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                { label: 'IP Whitelisting', desc: 'Restrict admin access to specific IPs', enabled: false },
                { label: 'Audit Logging', desc: 'Log all data access and modifications', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'users' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-500">Manage user roles and permissions across the platform.</p>
              <div className="space-y-2">
                {['Director', 'Principal', 'Teacher', 'Parent', 'Student', 'Administrator'].map(role => (
                  <div key={role} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm font-medium text-gray-900">{role}</div>
                    <button className="text-xs text-purple-600 font-medium hover:text-purple-700">Configure Permissions</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Primary Color</label>
                <div className="flex gap-3">
                  {['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map(color => (
                    <button key={color} className="w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-colors" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Theme</label>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border-2 border-purple-300 rounded-lg text-sm font-medium text-gray-900">Light</button>
                  <button className="px-4 py-2 bg-gray-800 border-2 border-gray-600 rounded-lg text-sm font-medium text-white">Dark</button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <button onClick={handleSave} className={`px-6 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              saved ? 'bg-green-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}>
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
