import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTournamentById } from '../../redux/slices/tournamentSlice';
import { createRegistration } from '../../redux/slices/registrationSlice';

const TournamentDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedTournament, isLoading, error } = useSelector((state) => state.tournaments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTournamentById(id));
  }, [dispatch, id]);

  const handleRegister = () => {
    if (user) {
      dispatch(createRegistration({ tournamentId: id, competitorId: user._id }));
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {isLoading && <p>Loading...</p>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
      {selectedTournament && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{selectedTournament.name}</h1>
          <p className="text-gray-600 mb-4">{new Date(selectedTournament.date).toLocaleDateString()}</p>
          <p className="mb-6">{selectedTournament.description}</p>
          {user && user.role === 'competitor' && (
            <button
              onClick={handleRegister}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Register for this Tournament
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TournamentDetails;
