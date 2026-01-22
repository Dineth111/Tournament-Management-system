import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="px-8 py-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500 bg-opacity-20">
                <FaExclamationTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="mt-6 text-3xl font-extrabold text-white">
                Access Denied
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                You don't have permission to access this page.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Please contact your administrator if you believe this is an error.
              </p>
            </div>
            
            <div className="mt-10">
              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaArrowLeft className="mr-2" />
                Go Back
              </button>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  Return to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;