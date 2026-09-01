'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Menu,
  LogOut,
  LayoutDashboard,
  BookOpen,
  DollarSign,
  UserCog,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  Phone,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  imageUrl: string | null;
  email: string | null;
  phone: string | null;
  department: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface AdminData {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function TeamManagementPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    imageUrl: '',
    email: '',
    phone: '',
    department: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    isActive: true,
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
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
      fetchTeamMembers();
    }
  }, [search, statusFilter, admin]);

  const fetchTeamMembers = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/team?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTeamMembers(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin');
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      title: '',
      bio: '',
      imageUrl: '',
      email: '',
      phone: '',
      department: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (member: TeamMember) => {
    setModalMode('edit');
    setSelectedMember(member);
    setFormData({
      name: member.name,
      title: member.title,
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      email: member.email || '',
      phone: member.phone || '',
      department: member.department || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      facebook: member.facebook || '',
      isActive: member.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = modalMode === 'create'
        ? '/api/admin/team'
        : `/api/admin/team/${selectedMember?.id}`;

      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          bio: formData.bio || null,
          imageUrl: formData.imageUrl || null,
          email: formData.email || null,
          phone: formData.phone || null,
          department: formData.department || null,
          linkedin: formData.linkedin || null,
          twitter: formData.twitter || null,
          facebook: formData.facebook || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        fetchTeamMembers();
        toast.success(data.message || 'Team member saved successfully!');
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('An error occurred while saving the team member');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchTeamMembers();
        toast.success(data.message || 'Team member deleted successfully!');
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('An error occurred while deleting the team member');
    }
  };

  const toggleStatus = async (member: TeamMember) => {
    try {
      const response = await fetch(`/api/admin/team/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !member.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchTeamMembers();
        toast.success('Status updated successfully!');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('An error occurred while updating the status');
    }
  };

  const updateOrder = async (member: TeamMember, direction: 'up' | 'down') => {
    const currentIndex = teamMembers.findIndex(m => m.id === member.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= teamMembers.length) return;

    const targetMember = teamMembers[targetIndex];

    try {
      // Swap orders
      await Promise.all([
        fetch(`/api/admin/team/${member.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: targetMember.order }),
        }),
        fetch(`/api/admin/team/${targetMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: member.order }),
        }),
      ]);

      fetchTeamMembers();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-blue-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-800 rounded"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
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
            <BookOpen size={20} />
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
            className="flex items-center gap-3 px-3 py-2 rounded bg-blue-800 mb-2"
          >
            <Users size={20} />
            {sidebarOpen && <span>Team Members</span>}
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
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 w-full"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Team Management
            </h2>
            <p className="text-gray-600">Manage faculty and staff profiles displayed on the website</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Members</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Inactive</p>
                  <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <XCircle className="text-gray-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </select>

                <button
                  onClick={openCreateModal}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Member
                </button>
              </div>
            </div>
          </div>

          {/* Team Members Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading team members...</div>
            ) : teamMembers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No team members found. Add your first team member to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Social
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamMembers.map((member, index) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateOrder(member, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button
                              onClick={() => updateOrder(member, 'down')}
                              disabled={index === teamMembers.length - 1}
                              className={`p-1 rounded ${index === teamMembers.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                              <ArrowDown size={16} />
                            </button>
                            <span className="text-gray-400 text-sm ml-2">#{member.order}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                              {member.imageUrl ? (
                                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-primary-600 font-bold">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {member.department || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            {member.email && (
                              <span title={member.email}>
                                <Mail size={16} className="text-gray-400" />
                              </span>
                            )}
                            {member.phone && (
                              <span title={member.phone}>
                                <Phone size={16} className="text-gray-400" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            {member.linkedin && (
                              <Linkedin size={16} className="text-blue-600" />
                            )}
                            {member.twitter && (
                              <Twitter size={16} className="text-sky-500" />
                            )}
                            {member.facebook && (
                              <Facebook size={16} className="text-blue-700" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(member)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              member.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {member.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(member)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="text-red-600 hover:text-red-800 p-1"
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
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Add Team Member' : 'Edit Team Member'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title/Position *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Professor, Director"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Herbal Medicine, Administration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief biography"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Social Media Links
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Linkedin size={20} className="text-blue-600" />
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="LinkedIn profile URL"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter size={20} className="text-sky-500" />
                      <input
                        type="url"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Twitter profile URL"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook size={20} className="text-blue-700" />
                      <input
                        type="url"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Facebook profile URL"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active (visible on website)
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {modalMode === 'create' ? 'Add Member' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
