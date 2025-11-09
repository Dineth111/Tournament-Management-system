import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllTournaments } from '../../redux/slices/tournamentSlice';

const Tournaments = () => {
  const dispatch = useDispatch();
  const { tournaments, isLoading, error } = useSelector((state) => state.tournaments);

  useEffect(() => {
    dispatch(fetchAllTournaments());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Tournaments</h1>
      {isLoading && <p>Loading...</p>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament._id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">{tournament.name}</h2>
            <p className="text-gray-600 mb-4">{new Date(tournament.date).toLocaleDateString()}</p>
            <Link
              to={`/tournaments/${tournament._id}`}
              className="text-blue-500 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tournaments;
