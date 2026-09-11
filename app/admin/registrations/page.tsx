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
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  UserCog,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  qualification: string;
  paymentStatus: string;
  amountPaid: number;
  createdAt: string;
  programme: {
    name: string;
    price: number;
  };
}

export default function RegistrationsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log('[REGISTRATIONS PAGE] Token retrieved:', token);
    console.log('[REGISTRATIONS PAGE] Token exists?', !!token);
    if (!token) {
      console.log('[REGISTRATIONS PAGE] No token, redirecting to /admin');
      router.push('/admin');
      return;
    }
    console.log('[REGISTRATIONS PAGE] Token verified, fetching registrations');

    fetchRegistrations();
  }, [router]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, registrations]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/registrations');
      const result = await response.json();

      if (result.success) {
        setRegistrations(result.data);
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...registrations];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (reg) => reg.paymentStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reg) =>
          reg.firstName.toLowerCase().includes(search) ||
          reg.lastName.toLowerCase().includes(search) ||
          reg.email.toLowerCase().includes(search) ||
          reg.phone.includes(search) ||
          reg.programme.name.toLowerCase().includes(search)
      );
    }

    setFilteredRegistrations(filtered);
  };

  const exportToCSV = () => {
    const csvData = [
      [
        'Name',
        'Email',
        'Phone',
        'City',
        'State',
        'Country',
        'Programme',
        'Qualification',
        'Payment Status',
        'Amount Paid',
        'Registration Date',
      ],
      ...filteredRegistrations.map((reg) => [
        `${reg.firstName} ${reg.lastName}`,
        reg.email,
        reg.phone,
        reg.city,
        reg.state,
        reg.country,
        reg.programme.name,
        reg.qualification,
        reg.paymentStatus,
        reg.amountPaid,
        new Date(reg.createdAt).toLocaleDateString(),
      ]),
    ];

    const csv = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </span>
        );
      default:
        return status;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  // Get admin data for role check
  const [admin, setAdmin] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    const adminDataStr = localStorage.getItem('adminData');
    if (adminDataStr) {
      setAdmin(JSON.parse(adminDataStr));
    }
  }, []);

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
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/registrations"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-800 transition-colors"
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
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Applicants / Registrations</h2>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total</h3>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Failed</h3>
              <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Programme
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          No registrations found
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((registration) => (
                        <tr key={registration.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {registration.firstName} {registration.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {registration.qualification}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{registration.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{registration.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {registration.programme.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(registration.programme.price)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {registration.city}, {registration.state}
                            </div>
                            <div className="text-sm text-gray-500">{registration.country}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(registration.paymentStatus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(registration.amountPaid)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(registration.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setSelectedRegistration(registration)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Registration Details
                </h3>
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">First Name</label>
                  <p className="text-gray-900">{selectedRegistration.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Name</label>
                  <p className="text-gray-900">{selectedRegistration.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedRegistration.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedRegistration.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Programme</label>
                  <p className="text-gray-900">{selectedRegistration.programme.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Qualification</label>
                  <p className="text-gray-900">{selectedRegistration.qualification}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-gray-900">
                    {selectedRegistration.city}, {selectedRegistration.state},{' '}
                    {selectedRegistration.country}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Status</label>
                  <div className="mt-1">{getStatusBadge(selectedRegistration.paymentStatus)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount Paid</label>
                  <p className="text-gray-900">
                    {formatCurrency(selectedRegistration.amountPaid)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
