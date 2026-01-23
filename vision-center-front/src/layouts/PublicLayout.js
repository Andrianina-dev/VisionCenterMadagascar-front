import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/accueil', label: 'Accueil' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/programmes', label: 'Programmes & Activités' },
    { path: '/ressources', label: 'Enseignements / Ressources' },
    { path: '/galerie', label: 'Galerie' },
    { path: '/actualites', label: 'Actualités' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link to="/accueil" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-lg">VC</span>
                </div>
                <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Vision Center Madagascar
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                    isActive(item.path) ? 'text-blue-600 border-b-2 border-blue-600' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Espace Membre →
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </nav>

          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="py-4 border-t border-gray-200">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors ${
                    isActive(item.path) ? 'bg-blue-50 text-blue-600 font-medium' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                to="/login" 
                className="block mt-4 mx-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg text-center hover:shadow-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Espace Membre →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VC</span>
                </div>
                <h3 className="text-xl font-bold">Vision Center Madagascar</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Centre de jeunes chrétiens engagé dans l'élévation morale, le développement personnel et la formation spirituelle.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="text-sm">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <span className="text-sm">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <span className="text-sm">i</span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/accueil" className="text-gray-300 hover:text-white transition-colors">Accueil</Link></li>
                <li><Link to="/a-propos" className="text-gray-300 hover:text-white transition-colors">À propos</Link></li>
                <li><Link to="/programmes" className="text-gray-300 hover:text-white transition-colors">Programmes</Link></li>
                <li><Link to="/ressources" className="text-gray-300 hover:text-white transition-colors">Ressources</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>Antananarivo, Madagascar</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>+261 34 12 345 67</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>✉️</span>
                  <span>contact@visioncenter.mg</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>🕒</span>
                  <span>Lun-Ven: 8h-17h</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Newsletter</h4>
              <p className="text-gray-300">
                Inscrivez-vous pour recevoir nos actualités et enseignements
              </p>
              <div className="flex flex-col space-y-2">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Vision Center Madagascar. Appuyé par One Seed Madagascar. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
