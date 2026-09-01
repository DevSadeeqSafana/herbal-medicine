'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Trash2,
  Eye,
  X,
  Menu,
  LogOut,
  LayoutDashboard,
  Users,
  DollarSign,
  GraduationCap,
  Mail,
  MessageSquare,
  Archive,
  CheckCircle,
  Clock,
  UserCog,
} from 'lucide-react';
import { Enquiry } from '@/types';

interface AdminData {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export default function EnquiriesPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.push('/admin');
      return;
    }

    const adminDataStr = localStorage.getItem('adminData');
    if (adminDataStr) {
      setAdmin(JSON.parse(adminDataStr));
    } else {
      setAdmin({
        id: 'admin-1',
        email: 'admin@cosmopolitan.edu.ng',
        name: 'System Administrator',
        role: 'superadmin',
      });
    }
  }, [router]);

  useEffect(() => {
    if (admin) {
      fetchEnquiries();
    }
  }, [search, statusFilter, admin]);

  const fetchEnquiries = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/enquiries?${params}`);
      const data = await response.json();

      if (data.success) {
        setEnquiries(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = async (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setNotes(enquiry.notes || '');
    setShowModal(true);

    // Mark as read if it's new
    if (enquiry.status === 'new') {
      await updateEnquiryStatus(enquiry.id, 'read');
    }
  };

  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, repliedBy: admin?.name }),
      });

      const data = await response.json();
      if (data.success) {
        fetchEnquiries();
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(data.data);
        }
      }
    } catch (error) {
      console.error('Error updating enquiry:', error);
    }
  };

  const saveNotes = async () => {
    if (!selectedEnquiry) return;

    try {
      const response = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();
      if (data.success) {
        fetchEnquiries();
        setSelectedEnquiry(data.data);
        alert('Notes saved successfully');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        fetchEnquiries();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      new: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Clock size={14} />,
      },
      read: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Eye size={14} />,
      },
      replied: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle size={14} />,
      },
      archived: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <Archive size={14} />,
      },
    };

    const badge = badges[status] || badges.new;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-blue-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } min-h-screen flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-blue-800">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-800 rounded"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 mb-2"
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </a>
          <a
            href="/admin/registrations"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 mb-2"
          >
            <Users size={20} />
            {sidebarOpen && <span>Registrations</span>}
          </a>
          <a
            href="/admin/programmes"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 mb-2"
          >
            <GraduationCap size={20} />
            {sidebarOpen && <span>Programmes</span>}
          </a>
          <a
            href="/admin/payments"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 mb-2"
          >
            <DollarSign size={20} />
            {sidebarOpen && <span>Payments</span>}
          </a>
          <a
            href="/admin/team"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 mb-2"
          >
            <Users size={20} />
            {sidebarOpen && <span>Team Members</span>}
          </a>
          <a
            href="/admin/enquiries"
            className="flex items-center gap-3 px-3 py-2 rounded bg-blue-800 mb-2"
          >
            <MessageSquare size={20} />
            {sidebarOpen && <span>Enquiries</span>}
            {stats.new > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {stats.new}
              </span>
            )}
          </a>
          {admin?.role === 'superadmin' && (
            <a
              href="/admin/users"
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 mb-2"
            >
              <UserCog size={20} />
              {sidebarOpen && <span>Manage Admins</span>}
            </a>
          )}
        </nav>

        <div className="p-4 border-t border-blue-800">
          {sidebarOpen && admin && (
            <div className="mb-3">
              <p className="text-sm font-semibold">{admin.name}</p>
              <p className="text-xs text-blue-300">{admin.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 w-full text-left"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Enquiries</h1>
          <p className="text-gray-600">Manage contact form submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <MessageSquare className="text-gray-400" size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New</p>
                <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <Clock className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Read</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
              </div>
              <Eye className="text-yellow-400" size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Replied</p>
                <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              </div>
              <CheckCircle className="text-green-400" size={24} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <Archive className="text-gray-400" size={24} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No enquiries found</h3>
              <p className="text-gray-500">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Contact form submissions will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {enquiries.map((enquiry) => (
                    <tr
                      key={enquiry.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        enquiry.status === 'new' ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => openViewModal(enquiry)}
                    >
                      <td className="px-6 py-4">
                        {getStatusBadge(enquiry.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`font-medium text-gray-900 ${enquiry.status === 'new' ? 'font-bold' : ''}`}>
                            {enquiry.name}
                          </p>
                          <p className="text-sm text-gray-500">{enquiry.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-gray-900 truncate max-w-xs ${enquiry.status === 'new' ? 'font-semibold' : ''}`}>
                          {enquiry.subject}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(enquiry.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openViewModal(enquiry);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEnquiry(enquiry.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* View Modal */}
      {showModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Enquiry Details</h2>
                <p className="text-sm text-gray-500">{formatDate(selectedEnquiry.createdAt)}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Status & Actions */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  {getStatusBadge(selectedEnquiry.status)}
                </div>
                <div className="flex gap-2">
                  {selectedEnquiry.status !== 'replied' && (
                    <button
                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'replied')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm flex items-center gap-1"
                    >
                      <CheckCircle size={14} />
                      Mark Replied
                    </button>
                  )}
                  {selectedEnquiry.status !== 'archived' && (
                    <button
                      onClick={() => updateEnquiryStatus(selectedEnquiry.id, 'archived')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm flex items-center gap-1"
                    >
                      <Archive size={14} />
                      Archive
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900 font-medium">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Mail size={14} />
                      {selectedEnquiry.email}
                    </a>
                  </p>
                </div>
                {selectedEnquiry.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedEnquiry.phone}</p>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-gray-900 font-medium">{selectedEnquiry.subject}</p>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-500">Message</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedEnquiry.message}</p>
                </div>
              </div>

              {/* Reply info */}
              {selectedEnquiry.repliedAt && (
                <div className="mb-6 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    Marked as replied on {formatDate(selectedEnquiry.repliedAt)}
                    {selectedEnquiry.repliedBy && ` by ${selectedEnquiry.repliedBy}`}
                  </p>
                </div>
              )}

              {/* Internal Notes */}
              <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Internal Notes (not visible to sender)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add notes about this enquiry..."
                />
                <button
                  onClick={saveNotes}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Save Notes
                </button>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={() => deleteEnquiry(selectedEnquiry.id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
              <a
                href={`mailto:${selectedEnquiry.email}?subject=Re: ${selectedEnquiry.subject}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Mail size={16} />
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
