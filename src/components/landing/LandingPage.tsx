import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '@/data/mockData';
import {
  GraduationCap, Users, BarChart3, Calendar, CreditCard, MessageSquare,
  Shield, Globe, ChevronRight, BookOpen, ClipboardCheck,
  Building2, ArrowRight, CheckCircle2, Star, Zap, Lock
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const goToAuth = () => navigate('/login');

  const features = [
    { icon: Users, title: 'Student Management', desc: 'Complete student profiles, enrollment tracking, and academic history management across all campuses.' },
    { icon: ClipboardCheck, title: 'Attendance Tracking', desc: 'Real-time attendance marking with instant parent notifications and comprehensive analytics.' },
    { icon: BookOpen, title: 'Digital Gradebook', desc: 'Comprehensive grading system with automatic calculations, report cards, and performance trends.' },
    { icon: Calendar, title: 'Smart Timetabling', desc: 'Intelligent scheduling with conflict detection, room allocation, and teacher availability management.' },
    { icon: CreditCard, title: 'Financial Management', desc: 'Automated billing, online payments, fee tracking, and detailed financial reporting.' },
    { icon: MessageSquare, title: 'Communication Hub', desc: 'Integrated messaging, announcements, and push notifications connecting all stakeholders.' },
    { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Institution-wide insights with enrollment trends, performance comparisons, and revenue analytics.' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Secure access control ensuring each user sees only what they need, from directors to students.' },
    { icon: Globe, title: 'Multi-Campus Support', desc: 'Manage multiple schools under one institution with independent data and combined analytics.' },
  ];

  const stats = [
    { value: '1,155+', label: 'Students Enrolled' },
    { value: '75+', label: 'Expert Teachers' },
    { value: '3', label: 'Campus Locations' },
    { value: '96%', label: 'Attendance Rate' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={IMAGES.logo} alt="Purpose Finder Academy" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Purpose Finder</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest -mt-0.5">Academy</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#campuses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Campuses</a>
            <a href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={goToAuth}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-purple-200 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                Next-Generation School Management
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Unified Platform for{' '}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Multi-Campus
                </span>{' '}
                Excellence
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Connect directors, principals, teachers, parents, and students in one powerful ecosystem. 
                Purpose Finder Academy's cloud-native platform transforms how educational institutions operate.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={goToAuth}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-purple-200 transition-all duration-300 flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#features"
                  className="px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  Explore Features
                </a>
              </div>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-200/50">
                <img src={IMAGES.hero} alt="Platform Dashboard" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">96% Attendance</div>
                    <div className="text-xs text-gray-500">Across all campuses</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">A+ Average</div>
                    <div className="text-xs text-gray-500">Academic performance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mb-4">
              <Building2 className="w-3.5 h-3.5" />
              Comprehensive Platform
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need to Manage Your Institution
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From enrollment to graduation, our platform covers every aspect of school management with modern, intuitive tools.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campuses Section */}
      <section id="campuses" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Campuses</h2>
            <p className="mt-4 text-lg text-gray-600">Three world-class campuses united under one digital ecosystem.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Main Campus', students: 485, teachers: 32, img: IMAGES.schools[0], est: '2015' },
              { name: 'West Campus', students: 372, teachers: 24, img: IMAGES.schools[1], est: '2018' },
              { name: 'East Campus', students: 298, teachers: 19, img: IMAGES.schools[2], est: '2021' },
            ].map((campus, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img src={campus.img} alt={campus.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-900">
                      Est. {campus.est}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{campus.name}</h3>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{campus.students}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-indigo-600">{campus.teachers}</div>
                      <div className="text-xs text-gray-500">Teachers</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA Section */}
      <section id="about" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 p-12 lg:p-20">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-lg text-purple-100 mb-8">
                Join Purpose Finder Academy's digital ecosystem and experience the future of education management. 
                Create your account to get started.
              </p>
              <button
                onClick={goToAuth}
                className="px-10 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
              >
                Create Account <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={IMAGES.logo} alt="Logo" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="text-white font-bold">Purpose Finder</div>
                  <div className="text-xs text-gray-500">Academy</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                A modern cloud-native school management platform connecting educators, students, and families.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                {['Student Management', 'Attendance Tracking', 'Digital Gradebook', 'Financial Management', 'Communication'].map(item => (
                  <li key={item}><button onClick={goToAuth} className="hover:text-white transition-colors">{item}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Institution</h4>
              <ul className="space-y-2 text-sm">
                {['Main Campus', 'West Campus', 'East Campus', 'Admissions', 'Careers'].map(item => (
                  <li key={item}><button className="hover:text-white transition-colors">{item}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                {['Help Center', 'Documentation', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map(item => (
                  <li key={item}><button className="hover:text-white transition-colors">{item}</button></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 Purpose Finder Academy. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Secured with enterprise-grade encryption</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
