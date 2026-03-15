import React, { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { IMAGES } from '@/data/mockData';
import { UserRole } from '@/types/school';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Building2, GraduationCap,
  ArrowLeft, Loader2, CheckCircle2, AlertCircle, ChevronDown, Shield
} from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'reset';

const AuthPage: React.FC = () => {
  const { signIn, signUp, resetPassword, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial mode from the URL path
  const getInitialMode = (): AuthMode => {
    if (location.pathname === '/signup') return 'signup';
    if (location.pathname === '/reset-password') return 'reset';
    return 'login';
  };

  const [mode, setMode] = useState<AuthMode>(getInitialMode);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [schoolId, setSchoolId] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const schools = [
    { id: 's1', name: 'Main Campus' },
    { id: 's2', name: 'West Campus' },
    { id: 's3', name: 'East Campus' },
  ];

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: 'director', label: 'Director', desc: 'Institution oversight' },
    { value: 'principal', label: 'Principal', desc: 'School management' },
    { value: 'teacher', label: 'Teacher', desc: 'Classroom tools' },
    { value: 'parent', label: 'Parent', desc: 'Child progress' },
    { value: 'student', label: 'Student', desc: 'Learning portal' },
    { value: 'admin', label: 'Administrator', desc: 'System config' },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (mode !== 'reset') {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!role) {
        newErrors.role = 'Please select a role';
      }

      if (role !== 'director' && !schoolId) {
        newErrors.schoolId = 'Please select a campus';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setServerError(error);
        } else {
          navigate('/');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp({
          email,
          password,
          name: name.trim(),
          role,
          schoolId: role === 'director' ? undefined : schoolId,
          phone,
        });
        if (error) {
          setServerError(error);
        } else {
          navigate('/');
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          setServerError(error);
        } else {
          setResetSent(true);
        }
      }
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setServerError('');
    setResetSent(false);
  };

  const inputClasses = (field: string) =>
    `w-full pl-11 pr-4 py-3 border rounded-xl text-sm transition-all duration-200 outline-none ${
      errors[field]
        ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100'
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src={IMAGES.logo} alt="Logo" className="w-12 h-12 rounded-full border-2 border-white/20" />
              <div>
                <div className="text-xl font-bold text-white">Purpose Finder</div>
                <div className="text-xs text-purple-200 uppercase tracking-widest">Academy</div>
              </div>
            </Link>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Empowering Education<br />Across Every Campus
            </h2>
            <p className="text-lg text-purple-200 max-w-md leading-relaxed">
              Join over 1,155 students and 75 teachers already using our platform to transform education management.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '3', label: 'Campuses' },
                { value: '96%', label: 'Attendance' },
                { value: 'A+', label: 'Average' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-purple-200 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-purple-200 text-sm">
            <Shield className="w-4 h-4" />
            <span>Enterprise-grade security with end-to-end encryption</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={IMAGES.logo} alt="Logo" className="w-10 h-10 rounded-full" />
              <div>
                <div className="text-lg font-bold text-gray-900">Purpose Finder</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Academy</div>
              </div>
            </Link>
          </div>

          {/* Back to home */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'login' && 'Welcome back'}
              {mode === 'signup' && 'Create your account'}
              {mode === 'reset' && 'Reset your password'}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {mode === 'login' && 'Sign in to access your dashboard and manage your school.'}
              {mode === 'signup' && 'Join Purpose Finder Academy\'s digital ecosystem.'}
              {mode === 'reset' && 'Enter your email and we\'ll send you a reset link.'}
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Authentication Error</p>
                <p className="text-sm text-red-600 mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          {/* Reset Success */}
          {resetSent && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Check your email</p>
                <p className="text-sm text-green-600 mt-0.5">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                    placeholder="Dr. Sarah Mitchell"
                    className={inputClasses('name')}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                  placeholder="you@purposefinder.edu"
                  className={inputClasses('email')}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            {mode !== 'reset' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('reset')}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                    placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Enter your password'}
                    className={inputClasses('password')}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>
            )}

            {/* Confirm Password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                    placeholder="Repeat your password"
                    className={inputClasses('confirmPassword')}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Role (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Role</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={role}
                    onChange={(e) => { setRole(e.target.value as UserRole); setErrors(p => ({ ...p, role: '' })); }}
                    className={`${inputClasses('role')} appearance-none cursor-pointer`}
                  >
                    {roles.map(r => (
                      <option key={r.value} value={r.value}>
                        {r.label} — {r.desc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
              </div>
            )}

            {/* Campus (signup, non-director) */}
            {mode === 'signup' && role !== 'director' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Campus</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={schoolId}
                    onChange={(e) => { setSchoolId(e.target.value); setErrors(p => ({ ...p, schoolId: '' })); }}
                    className={`${inputClasses('schoolId')} appearance-none cursor-pointer`}
                  >
                    <option value="">Select a campus...</option>
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.schoolId && <p className="mt-1 text-xs text-red-500">{errors.schoolId}</p>}
              </div>
            )}

            {/* Phone (signup, optional) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1-555-0100"
                    className={inputClasses('phone')}
                    autoComplete="tel"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending link...'}
                </>
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 text-center space-y-3">
            {mode === 'login' && (
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button onClick={() => switchMode('signup')} className="text-purple-600 font-semibold hover:text-purple-700">
                  Sign up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <button onClick={() => switchMode('login')} className="text-purple-600 font-semibold hover:text-purple-700">
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <p className="text-sm text-gray-500">
                Remember your password?{' '}
                <button onClick={() => switchMode('login')} className="text-purple-600 font-semibold hover:text-purple-700">
                  Back to sign in
                </button>
              </p>
            )}
          </div>

          {/* Demo Accounts Info */}
          <div className="mt-8 p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <p className="text-xs font-semibold text-purple-800 mb-2">Quick Start</p>
            <p className="text-xs text-purple-600 leading-relaxed">
              Create a new account with any email and password to get started. Choose your role during signup to access the corresponding dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
