import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUsers, FaTrophy, FaCalendarAlt, FaChartBar, FaDownload, FaFacebook, FaInstagram, FaTwitter, FaGithub, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaRegQuestionCircle, FaRegLightbulb } from 'react-icons/fa';

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
      <header className="bg-black bg-opacity-60 backdrop-blur sticky top-0 z-50 border-b border-gray-800">
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
              <a href="#support" className="text-gray-300 hover:text-white transition-colors duration-200">Support</a>
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

      {/* Hero Section with Background Image */}
      <main>
        <div className="relative w-full min-h-[600px] flex items-center justify-center bg-black">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Karate Hero" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                <span className="block">Master Your</span>
                <span className="block bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent mt-2">
                  Karate Tournaments
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-200 max-w-2xl">
                The ultimate platform for organizing, managing, and running professional karate tournaments. Streamline your events with our powerful tools designed specifically for martial arts competitions.
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
                <div className="bg-gray-800 bg-opacity-60 rounded-xl p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-white">142</div>
                  <div className="text-sm text-gray-400">Players</div>
                </div>
                <div className="bg-gray-800 bg-opacity-60 rounded-xl p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-white">8</div>
                  <div className="text-sm text-gray-400">Tournaments</div>
                </div>
                <div className="bg-gray-800 bg-opacity-60 rounded-xl p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col items-center gap-8">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-yellow-500 rounded-2xl transform rotate-3 blur-lg opacity-60"></div>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* About Section */}
        <section id="about" className="bg-gray-900 py-16 border-t border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
            <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80" alt="About Karate" className="rounded-2xl shadow-xl border-4 border-red-600 w-full max-w-xs object-cover" />
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">About Expert Karate</h2>
              <p className="text-lg text-gray-300 mb-4">Expert Karate is a next-generation tournament management system designed for martial arts organizations, clubs, and event organizers. Our mission is to empower you to run seamless, professional, and engaging karate tournaments with ease.</p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>All-in-one platform for registration, scheduling, brackets, and results</li>
                <li>Role-based dashboards for admins, coaches, judges, and players</li>
                <li>Real-time analytics and reporting</li>
                <li>Modern, mobile-friendly design</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold text-red-500 tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                Everything you need for karate tournaments
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
                Our platform provides all the tools necessary to organize, manage, and run successful karate tournaments.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white text-3xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-base text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Support Section */}
        <section id="support" className="bg-gray-900 py-16 border-t border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2"><FaRegQuestionCircle className="text-yellow-400" /> Support & Help</h2>
              <p className="text-lg text-gray-300 mb-4">Need assistance? Our support team is here to help you with any questions or issues you may have. Access our help center, documentation, or contact us directly for personalized support.</p>
              <ul className="list-disc pl-6 text-gray-400 space-y-2">
                <li>Comprehensive help center and FAQs</li>
                <li>Step-by-step documentation</li>
                <li>Live chat and email support</li>
                <li>Community forums and resources</li>
              </ul>
            </div>
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80" alt="Support" className="rounded-2xl shadow-xl border-4 border-yellow-500 w-full max-w-xs object-cover" />
          </div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 border-t border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2"><FaEnvelope className="text-yellow-400" /> Contact Us</h2>
              <p className="text-lg text-gray-300 mb-4">Have questions, feedback, or want to partner with us? Reach out to our team and we’ll get back to you as soon as possible.</p>
              <ul className="text-gray-400 space-y-2">
                <li className="flex items-center gap-2"><FaEnvelope className="text-yellow-400" /> <span>info@expertkarate.com</span></li>
                <li className="flex items-center gap-2"><FaPhoneAlt className="text-yellow-400" /> <span>+1 (555) 123-4567</span></li>
                <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-yellow-400" /> <span>123 Martial Arts Ave, Colombo, Sri Lanka</span></li>
              </ul>
            </div>
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=500&q=80" alt="Contact" className="rounded-2xl shadow-xl border-4 border-yellow-500 w-full max-w-xs object-cover" />
          </div>
        </section>

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

      {/* Footer - Next Level Design */}
      <footer className="relative bg-black border-t border-gray-800 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1200&q=80" alt="Karate Footer" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand & Social */}
            <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-red-600 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <FaTrophy className="text-white text-2xl" />
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Expert Karate
                </span>
              </div>
              <p className="mt-2 text-base text-gray-400 max-w-md">
                The ultimate platform for organizing and managing professional karate tournaments. Designed for martial arts competitions with features tailored to karate events.
              </p>
              <div className="mt-6 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-200" aria-label="Facebook">
                  <FaFacebook className="h-7 w-7" />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors duration-200" aria-label="Instagram">
                  <FaInstagram className="h-7 w-7" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200" aria-label="Twitter">
                  <FaTwitter className="h-7 w-7" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors duration-200" aria-label="GitHub">
                  <FaGithub className="h-7 w-7" />
                </a>
              </div>
            </div>
            {/* Solutions */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 tracking-wider uppercase flex items-center gap-2 mb-4"><FaRegLightbulb className="text-yellow-400" /> Solutions</h3>
              <ul className="space-y-3">
                <li><a href="#" className="flex items-center gap-2 text-base text-gray-300 hover:text-yellow-400 transition-colors duration-200"><FaTrophy /> Tournament Management</a></li>
                <li><a href="#" className="flex items-center gap-2 text-base text-gray-300 hover:text-yellow-400 transition-colors duration-200"><FaUsers /> Player Registration</a></li>
                <li><a href="#" className="flex items-center gap-2 text-base text-gray-300 hover:text-yellow-400 transition-colors duration-200"><FaChartBar /> Bracket Generation</a></li>
                <li><a href="#" className="flex items-center gap-2 text-base text-gray-300 hover:text-yellow-400 transition-colors duration-200"><FaCalendarAlt /> Results Tracking</a></li>
              </ul>
            </div>
            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 tracking-wider uppercase flex items-center gap-2 mb-4"><FaRegQuestionCircle className="text-yellow-400" /> Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="flex items-center gap-2 text-base text-gray-300 hover:text-yellow-400 transition-colors duration-200"><FaRegQuestionCircle /> Help Center</a></li>
                <li><a href="#" className="flex items-center gap-2 text-base text-gray-300 hover:text-yellow-400 transition-colors duration-200"><FaDownload /> Documentation</a></li>
                <li><a href="#contact" className="flex items-center gap-2 text-base text-gray-300 hover:text-yellow-400 transition-colors duration-200"><FaEnvelope /> Contact Us</a></li>
                <li><a href="#" className="flex items-center gap-2 text-base text-gray-300 hover:text-yellow-400 transition-colors duration-200"><FaChartBar /> API Status</a></li>
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