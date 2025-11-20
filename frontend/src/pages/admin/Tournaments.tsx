import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import toast from 'react-hot-toast';

interface Tournament {
  _id: string;
  name: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  registrationDeadline: string;
  registrationFee: number;
  maxParticipants: number;
  status: string;
  participants: number;
}

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventType: 'kata',
    startDate: '',
    endDate: '',
    location: '',
    registrationDeadline: '',
    registrationFee: 0,
    maxParticipants: 50,
    status: 'Upcoming',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch tournaments from API
  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getTournaments();
      // Ensure all tournaments have the required fields
      const tournamentsWithDefaults = response.data.map((tournament: any) => ({
        ...tournament,
        name: tournament.name || 'Unnamed Tournament',
        description: tournament.description || '',
        eventType: tournament.eventType || 'kata',
        startDate: tournament.startDate || new Date().toISOString(),
        endDate: tournament.endDate || new Date().toISOString(),
        location: tournament.location || 'Not specified',
        registrationDeadline: tournament.registrationDeadline || new Date().toISOString(),
        registrationFee: tournament.registrationFee || 0,
        maxParticipants: tournament.maxParticipants || 50,
        status: tournament.status || 'Upcoming',
        participants: tournament.participants || 0
      }));
      setTournaments(tournamentsWithDefaults);
    } catch (error: any) {
      toast.error('Failed to fetch tournaments');
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = () => {
    setEditingTournament(null);
    setFormData({
      name: '',
      description: '',
      eventType: 'kata',
      startDate: '',
      endDate: '',
      location: '',
      registrationDeadline: '',
      registrationFee: 0,
      maxParticipants: 50,
      status: 'Upcoming',
    });
    setIsModalOpen(true);
  };

  const handleEditTournament = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setFormData({
      name: tournament.name,
      description: tournament.description,
      eventType: tournament.eventType,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      location: tournament.location,
      registrationDeadline: tournament.registrationDeadline,
      registrationFee: tournament.registrationFee,
      maxParticipants: tournament.maxParticipants,
      status: tournament.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteTournament = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await adminApi.deleteTournament(id);
        toast.success('Tournament deleted successfully');
        fetchTournaments(); // Refresh the list
      } catch (error: any) {
        toast.error('Failed to delete tournament');
        console.error('Error deleting tournament:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editingTournament) {
        // Update existing tournament
        const response = await adminApi.updateTournament(editingTournament._id, formData);
        toast.success('Tournament updated successfully');
        setTournaments(tournaments.map(tournament => 
          tournament._id === editingTournament._id ? {...response.data, participants: response.data.participants || 0} : tournament
        ));
      } else {
        // Create new tournament
        const response = await adminApi.createTournament(formData);
        toast.success('Tournament created successfully');
        setTournaments([...tournaments, {...response.data, participants: response.data.participants || 0}]);
      }
      
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(editingTournament ? 'Failed to update tournament' : 'Failed to create tournament');
      console.error('Error saving tournament:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'registrationFee' || name === 'maxParticipants' ? Number(value) : value }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tournament Management</h1>
                <p className="mt-2 text-gray-600">Manage all tournaments in the system</p>
              </div>
              <button
                onClick={handleCreateTournament}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Tournament
              </button>
            </div>
          </div>

          {/* Tournaments Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
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
                  ) : tournaments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No tournaments found
                      </td>
                    </tr>
                  ) : (
                    tournaments.map((tournament) => (
                      <tr key={tournament._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{tournament.name}</div>
                          <div className="text-sm text-gray-500">{tournament.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 capitalize">{tournament.eventType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tournament.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tournament.status === 'Registration Open' ? 'bg-green-100 text-green-800' :
                            tournament.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800' :
                            tournament.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tournament.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tournament.participants} / {tournament.maxParticipants}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditTournament(tournament)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTournament(tournament._id)}
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
                  {editingTournament ? 'Edit Tournament' : 'Create Tournament'}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tournament Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Tournament Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Event Type"
                    >
                      <option value="kata">Kata</option>
                      <option value="kumite">Kumite</option>
                      <option value="team">Team Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Start Date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="End Date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Deadline
                    </label>
                    <input
                      type="date"
                      name="registrationDeadline"
                      value={formData.registrationDeadline}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Registration Deadline"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Fee ($)
                    </label>
                    <input
                      type="number"
                      name="registrationFee"
                      value={formData.registrationFee}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Registration Fee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Max Participants"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Status"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Registration Open">Registration Open</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      aria-label="Description"
                    />
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
                    {submitting ? 'Saving...' : (editingTournament ? 'Update' : 'Create')}
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