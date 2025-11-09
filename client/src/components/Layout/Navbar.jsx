import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-700">
            <Link to="/">Karate Tournament</Link>
          </div>
          <div className="flex items-center">
            <Link to="/tournaments" className="text-gray-600 hover:text-gray-800 px-3 py-2">Tournaments</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 px-3 py-2">Dashboard</Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-800 px-3 py-2">{user?.name}</Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md ml-4">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-800 px-3 py-2">Login</Link>
                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
