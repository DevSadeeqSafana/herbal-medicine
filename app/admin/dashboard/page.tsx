'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  LogOut,
  Menu,
  X,
  MessageSquare,
  UserCog,
} from 'lucide-react';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

interface AdminData {
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    pendingPayments: 0,
    completedPayments: 0,
    activeProgrammes: 0,
  });

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    console.log('[DASHBOARD PAGE] Token retrieved:', token);
    console.log('[DASHBOARD PAGE] Token exists?', !!token);
    if (!token) {
      console.log('[DASHBOARD PAGE] No token, redirecting to /admin');
      router.push('/admin');
      return;
    }
    console.log('[DASHBOARD PAGE] Token verified, loading dashboard');

    // TODO: Fetch admin data and stats from API
    // For now, using mock data
    setAdmin({
      name: 'System Administrator',
      email: 'admin@cosmopolitan.edu.ng',
      role: 'superadmin',
    });

    setStats({
      totalRegistrations: 24,
      pendingPayments: 8,
      completedPayments: 16,
      activeProgrammes: 3,
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/registrations"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Registrations</span>
          </Link>

          <Link
            href="/admin/programmes"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Programmes</span>
          </Link>

          <Link
            href="/admin/payments"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>Payments</span>
          </Link>

          <Link
            href="/admin/team"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Team Members</span>
          </Link>

          <Link
            href="/admin/enquiries"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Enquiries</span>
          </Link>

          {admin?.role === 'superadmin' && (
            <Link
              href="/admin/users"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <UserCog className="w-5 h-5" />
              <span>Manage Admins</span>
            </Link>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
          <div className="mb-3">
            <p className="text-sm font-semibold">{admin.name}</p>
            <p className="text-xs text-blue-300">{admin.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Registrations */}
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Total</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {stats.totalRegistrations}
              </h3>
              <p className="text-sm text-gray-600">Total Registrations</p>
            </div>
            </AnimatedSection>

            {/* Pending Payments */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Pending</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {stats.pendingPayments}
              </h3>
              <p className="text-sm text-gray-600">Pending Payments</p>
            </div>
            </AnimatedSection>

            {/* Completed Payments */}
            <AnimatedSection delay={0.3}>
              <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Completed</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {stats.completedPayments}
              </h3>
              <p className="text-sm text-gray-600">Completed Payments</p>
            </div>
            </AnimatedSection>

            {/* Active Programmes */}
            <AnimatedSection delay={0.4}>
              <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Active</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {stats.activeProgrammes}
              </h3>
              <p className="text-sm text-gray-600">Active Programmes</p>
            </div>
            </AnimatedSection>
          </div>

          {/* Quick Actions */}
          <AnimatedSection delay={0.5}>
            <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/registrations"
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>View Registrations</span>
              </Link>

              <Link
                href="/admin/programmes"
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Manage Programmes</span>
              </Link>

              <Link
                href="/admin/payments"
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                <span>Track Payments</span>
              </Link>
            </div>
          </div>
          </AnimatedSection>
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
