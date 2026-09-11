'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  BookOpen,
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
  Users,
  DollarSign,
  Calendar,
  Clock,
  UserCog,
  List,
  MessageSquare,
} from 'lucide-react';

interface Programme {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  curriculum: string;
  startDate: string | null;
  endDate: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    registrations: number;
  };
}

interface AdminData {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export default function ProgrammesPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    startDate: '',
    endDate: '',
    isActive: true,
    curriculumModules: [] as string[],
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    console.log('[PROGRAMMES PAGE] Token retrieved:', token);
    console.log('[PROGRAMMES PAGE] Token exists?', !!token);

    if (!token) {
      console.log('[PROGRAMMES PAGE] No token, redirecting to /admin');
      router.push('/admin');
      return;
    }

    console.log('[PROGRAMMES PAGE] Token verified, setting admin data');
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
      fetchProgrammes();
    }
  }, [search, statusFilter, admin]);

  const fetchProgrammes = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('isActive', statusFilter);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/programmes?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProgrammes(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching programmes:', error);
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
      description: '',
      duration: '',
      price: '',
      startDate: '',
      endDate: '',
      isActive: true,
      curriculumModules: [],
    });
    setShowModal(true);
  };

  const openEditModal = (programme: Programme) => {
    setModalMode('edit');
    setSelectedProgramme(programme);
    let curriculumModules: string[] = [];
    try {
      curriculumModules = JSON.parse(programme.curriculum || '[]');
    } catch {
      curriculumModules = [];
    }
    setFormData({
      name: programme.name,
      description: programme.description,
      duration: programme.duration,
      price: programme.price.toString(),
      startDate: programme.startDate ? programme.startDate.split('T')[0] : '',
      endDate: programme.endDate ? programme.endDate.split('T')[0] : '',
      isActive: programme.isActive,
      curriculumModules,
    });
    setShowModal(true);
  };

  // Curriculum module management
  const addModule = () => {
    setFormData({
      ...formData,
      curriculumModules: [...formData.curriculumModules, ''],
    });
  };

  const removeModule = (index: number) => {
    const updated = formData.curriculumModules.filter((_, i) => i !== index);
    setFormData({ ...formData, curriculumModules: updated });
  };

  const updateModule = (index: number, value: string) => {
    const updated = [...formData.curriculumModules];
    updated[index] = value;
    setFormData({ ...formData, curriculumModules: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = modalMode === 'create'
        ? '/api/admin/programmes'
        : `/api/admin/programmes/${selectedProgramme?.id}`;

      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          duration: formData.duration,
          price: parseFloat(formData.price),
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          isActive: formData.isActive,
          curriculum: JSON.stringify(formData.curriculumModules.filter(m => m.trim() !== '')),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        fetchProgrammes();
        toast.success(data.message || 'Programme saved successfully!');
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving programme:', error);
      toast.error('An error occurred while saving the programme');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this programme?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/programmes/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchProgrammes();
        toast.success(data.message || 'Programme deleted successfully!');
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting programme:', error);
      toast.error('An error occurred while deleting the programme');
    }
  };

  const toggleStatus = async (programme: Programme) => {
    try {
      const response = await fetch(`/api/admin/programmes/${programme.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...programme,
          isActive: !programme.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchProgrammes();
        toast.success('Programme status updated successfully!');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('An error occurred while updating the status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            className="flex items-center gap-3 px-3 py-2 rounded bg-blue-800 mb-2"
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
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 mb-2"
          >
            <Users size={20} />
            {sidebarOpen && <span>Team Members</span>}
          </a>
          <a
            href="/admin/enquiries"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-800 mb-2"
          >
            <MessageSquare size={20} />
            {sidebarOpen && <span>Enquiries</span>}
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
              Programmes Management
            </h2>
            <p className="text-gray-600">Manage academic programmes and courses</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Programmes</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="text-blue-600" size={24} />
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
                    placeholder="Search programmes..."
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
                  Add Programme
                </button>
              </div>
            </div>
          </div>

          {/* Programmes Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading programmes...</div>
            ) : programmes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No programmes found. Create your first programme to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Programme
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
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
                    {programmes.map((programme) => (
                      <tr key={programme.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{programme.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {programme.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Clock size={16} className="text-gray-400" />
                            {programme.duration}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(programme.price)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} className="text-gray-400" />
                            {formatDate(programme.startDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {programme._count.registrations}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(programme)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              programme.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {programme.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(programme)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(programme.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete"
                              disabled={programme._count.registrations > 0}
                            >
                              <Trash2
                                size={18}
                                className={
                                  programme._count.registrations > 0 ? 'opacity-30' : ''
                                }
                              />
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
                {modalMode === 'create' ? 'Add New Programme' : 'Edit Programme'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Programme Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Diploma in Herbal Medicine"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the programme"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 6 months, 1 year"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (NGN) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="150000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active (visible to students)
                  </label>
                </div>

                {/* Curriculum Modules Section */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      <List size={16} className="inline mr-2" />
                      Curriculum Modules
                    </label>
                    <button
                      type="button"
                      onClick={addModule}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Add Module
                    </button>
                  </div>

                  {formData.curriculumModules.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">
                      No modules added yet. Click &quot;Add Module&quot; to add curriculum items.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {formData.curriculumModules.map((module, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm w-6">{index + 1}.</span>
                          <input
                            type="text"
                            value={module}
                            onChange={(e) => updateModule(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="e.g., Introduction to Herbal Medicine"
                          />
                          <button
                            type="button"
                            onClick={() => removeModule(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove module"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                  {modalMode === 'create' ? 'Create Programme' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
