import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Judge {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  certificationLevel: string;
  yearsOfExperience: number;
  specialization: string;
  assignedTournaments: number;
}

export default function Judges() {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJudge, setEditingJudge] = useState<Judge | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    certificationLevel: 'National',
    yearsOfExperience: 1,
    specialization: 'Kata',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch judges from API
  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getJudges();
      setJudges(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch judges');
      console.error('Error fetching judges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJudge = () => {
    setEditingJudge(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      certificationLevel: 'National',
      yearsOfExperience: 1,
      specialization: 'Kata',
    });
    setIsModalOpen(true);
  };

  const handleEditJudge = (judge: Judge) => {
    setEditingJudge(judge);
    setFormData({
      firstName: judge.firstName,
      lastName: judge.lastName,
      email: judge.email,
      certificationLevel: judge.certificationLevel,
      yearsOfExperience: judge.yearsOfExperience,
      specialization: judge.specialization,
    });
    setIsModalOpen(true);
  };

  const handleDeleteJudge = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this judge?')) {
      try {
        await adminApi.deleteJudge(id);
        toast.success('Judge deleted successfully');
        fetchJudges(); // Refresh the list
      } catch (error: any) {
        toast.error('Failed to delete judge');
        console.error('Error deleting judge:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingJudge) {
        // Update existing judge
        const response = await adminApi.updateJudge(editingJudge._id, formData);
        toast.success('Judge updated successfully');
        setJudges(judges.map(judge => 
          judge._id === editingJudge._id ? response.data : judge
        ));
      } else {
        // Create new judge
        const response = await adminApi.createJudge(formData);
        toast.success('Judge created successfully');
        setJudges([...judges, response.data]);
      }
      
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(editingJudge ? 'Failed to update judge' : 'Failed to create judge');
      console.error('Error saving judge:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'yearsOfExperience' ? Number(value) : value 
    }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Judge Management</h1>
                <p className="mt-2 text-gray-600">Manage all judges in the system</p>
              </div>
              <button
                onClick={handleCreateJudge}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Judge
              </button>
            </div>
          </div>

          {/* Judges Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certification</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tournaments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : judges.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No judges found
                      </td>
                    </tr>
                  ) : (
                    judges.map((judge) => (
                      <tr key={judge._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{judge.firstName} {judge.lastName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{judge.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {judge.certificationLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {judge.yearsOfExperience} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {judge.specialization}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {judge.assignedTournaments}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditJudge(judge)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJudge(judge._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingJudge ? 'Edit Judge' : 'Create Judge'}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Last Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Level
                    </label>
                    <select
                      name="certificationLevel"
                      value={formData.certificationLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Certification Level"
                    >
                      <option value="Regional">Regional</option>
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      min="0"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Years of Experience"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Specialization"
                    >
                      <option value="Kata">Kata</option>
                      <option value="Kumite">Kumite</option>
                      <option value="Team Event">Team Event</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : (editingJudge ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}