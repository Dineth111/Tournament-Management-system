import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUsers, FaTrophy, FaCalendarAlt, FaChartBar, FaDownload, FaFacebook, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';

const WelcomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaUsers className="h-6 w-6" />,
      title: "Player Management",
      description: "Easily register, organize, and manage karateka with detailed profiles, belt rankings, and statistics."
    },
    {
      icon: <FaTrophy className="h-6 w-6" />,
      title: "Tournament Brackets",
      description: "Create and manage elimination brackets, pools, and custom tournament structures with automated conflict detection."
    },
    {
      icon: <FaChartBar className="h-6 w-6" />,
      title: "Real-time Analytics",
      description: "Track performance metrics, generate reports, and visualize tournament progress with interactive charts."
    },
    {
      icon: <FaCalendarAlt className="h-6 w-6" />,
      title: "Schedule Management",
      description: "Plan and organize tournament schedules, match times, and venue assignments with conflict resolution."
    },
    {
      icon: <FaDownload className="h-6 w-6" />,
      title: "PDF Reports",
      description: "Generate and export detailed tournament reports, certificates, and results in professional PDF format."
    },
    {
      icon: <FaUserShield className="h-6 w-6" />,
      title: "Role-based Access",
      description: "Secure access control for admins, organizers, judges, coaches, and players with customized dashboards."
    }
  ];

  const upcomingMatches = [
    {
      id: 1,
      player1: { name: "Black Belt Kata", initials: "BK", color: "from-red-600 to-yellow-500" },
      player2: { name: "White Belt Kumite", initials: "WK", color: "from-blue-600 to-purple-500" },
      status: "Upcoming"
    },
    {
      id: 2,
      player1: { name: "Brown Belt Kumite", initials: "BK", color: "from-green-600 to-teal-500" },
      player2: { name: "Blue Belt Kata", initials: "BB", color: "from-yellow-600 to-orange-500" },
      status: "In Progress"
    },
    {
      id: 3,
      player1: { name: "Green Belt Kata", initials: "GK", color: "from-emerald-600 to-cyan-500" },
      player2: { name: "Orange Belt Kumite", initials: "OK", color: "from-amber-600 to-red-500" },
      status: "Completed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  <FaTrophy className="text-white text-2xl" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Expert Karate
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Tournament Management System</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <span className="block">Master Your</span>
                <span className="block bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent mt-2">
                  Karate Tournaments
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-2xl">
                The ultimate platform for organizing, managing, and running professional karate tournaments. 
                Streamline your events with our powerful tools designed specifically for martial arts competitions.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 text-base font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <FaDownload className="mr-2" />
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 text-base font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 flex items-center justify-center"
                >
                  Sign In
                </button>
              </div>
              
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-white">142</div>
                  <div className="text-sm text-gray-400">Players</div>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-white">8</div>
                  <div className="text-sm text-gray-400">Tournaments</div>
                </div>
                <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-yellow-500 rounded-2xl transform rotate-6 blur-lg opacity-75"></div>
                <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-lg font-bold text-white">Upcoming Matches</div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      {upcomingMatches.map((match) => (
                        <div key={match.id} className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500 transition-colors duration-200">
                          <div className={`w-10 h-10 bg-gradient-to-r ${match.player1.color} rounded-full flex items-center justify-center`}>
                            <span className="text-white font-bold">{match.player1.initials}</span>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="font-medium text-white">{match.player1.name}</div>
                            <div className="text-sm text-gray-400">vs {match.player2.name}</div>
                          </div>
                          <div className={`w-10 h-10 bg-gradient-to-r ${match.player2.color} rounded-full flex items-center justify-center`}>
                            <span className="text-white font-bold">{match.player2.initials}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm text-gray-400">Total Players</div>
                          <div className="text-2xl font-bold text-white">142</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Active Tournaments</div>
                          <div className="text-2xl font-bold text-white">8</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Completed</div>
                          <div className="text-2xl font-bold text-white">24</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-red-500 tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                Everything you need for karate tournaments
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
                Our platform provides all the tools necessary to organize, manage, and run successful karate tournaments.
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-red-600 to-yellow-500 text-white">
                      {feature.icon}
                    </div>
                    <div className="mt-5">
                      <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                      <p className="mt-2 text-base text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Ready to organize your</span>
                <span className="block bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent mt-2">
                  next karate tournament?
                </span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-300">
                Join hundreds of karate organizations who trust Expert Karate to run their events.
              </p>
              <div className="mt-10">
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <FaDownload className="mr-2" />
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <FaTrophy className="text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Expert Karate
                </span>
              </div>
              <p className="mt-4 text-base text-gray-400">
                The ultimate platform for organizing and managing professional karate tournaments. 
                Designed specifically for martial arts competitions with features tailored to karate events.
              </p>
              <div className="mt-6 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Facebook</span>
                  <FaFacebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Instagram</span>
                  <FaInstagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">GitHub</span>
                  <FaGithub className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">Tournament Management</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">Player Registration</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">Bracket Generation</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">Results Tracking</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white transition-colors duration-200">API Status</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2025 Expert Karate Tournament Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;