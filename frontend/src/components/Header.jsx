import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaTwitter, FaFacebook, FaGooglePlus, FaVimeoV, FaPinterest,
} from 'react-icons/fa';
import { selectUser } from '../redux/usersession/usersessionsSlice';
import Logout from './Logout';
import boatLogo from '../Assets/Images/logo/boat-logo-3.png';

const Header = () => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Links para landing page (simplificados)
  const landingLinks = [
    { path: '/explore', text: 'Explorar Botes' },
    ...(user ? [
      { path: '/my-reservations', text: 'Mis Reservas' }
    ] : [
      { path: '/login', text: 'Iniciar Sesión' },
      { path: '/signup', text: 'Registrarse' }
    ]),
  ];

  // Links completos para páginas internas
  const fullLinks = [
    { path: '/explore', text: 'Explore' },
    { path: '/boats', text: 'Boats' },
    { path: '/reserve', text: 'Reserve' },
    { path: '/my-reservations', text: 'My Reservations' },
    { path: '/add-boat', text: 'Add Boat' },
    { path: '/delete-boat', text: 'Delete Boat' },
    ...(user ? [] : [{ path: '/login', text: 'Login' }, { path: '/signup', text: 'Sign up' }]),
  ];

  const links = isLandingPage ? landingLinks : fullLinks;

  const [isOpen, setIsOpen] = useState(false);

  // Navbar horizontal para landing page
  if (isLandingPage) {
    return (
      <header className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img src={boatLogo} alt="Boats Logo" className="h-12 w-auto" />
            <span className="ml-2 text-xl font-bold text-blue-600">BoatRental</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map(({ path, text }) => (
              <NavLink
                key={text}
                to={path}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {text}
              </NavLink>
            ))}
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hola, {user.name}</span>
                <Logout />
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile menu */}
          <nav
            className={`md:hidden fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <img src={boatLogo} alt="Boats Logo" className="h-10 w-auto" />
                <span className="ml-2 text-lg font-bold text-blue-600">BoatRental</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <ul className="py-4">
              {links.map(({ path, text }) => (
                <li key={text}>
                  <NavLink
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {text}
                  </NavLink>
                </li>
              ))}
              {user && (
                <li className="px-4 py-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Hola, {user.name}</span>
                    <Logout />
                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  // Layout original (sidebar) para páginas internas
  return (
    <header className="p-4 h-full border-b border-slate-300">
      {/* Mobile */}
      <section className="lg:hidden">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="lg:hidden"
            aria-label="Open"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>

          <img src={boatLogo} alt="Boat Logo" className="w-20" />
        </div>

        <nav
          className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white transform transition-transform duration-200 ease-in-out p-4 flex flex-col justify-between ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <img src={boatLogo} alt="Boat Logo" className="w-20" />
          </div>

          <ul className="flex flex-col text-xl font-bold items-center mb-[150px] uppercase">
            {links.map(({ path, text }) => (
              <li key={text} className="w-full">
                <NavLink
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center py-4"
                >
                  {text}
                </NavLink>
              </li>
            ))}
            {user && (
              <li className="text-center py-3">
                Hi
                {' '}
                {user.name}
                {' | '}
                <Logout />
              </li>
            )}
          </ul>

          <div className="pb-6">
            <div className="flex justify-center space-x-8 py-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://plus.google.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Plus"
              >
                <FaGooglePlus />
              </a>
              <a
                href="https://vimeo.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vimeo"
              >
                <FaVimeoV />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
              >
                <FaPinterest />
              </a>
            </div>
            <p className="text-xs text-center">&copy; 2023 Boats</p>
          </div>
        </nav>
      </section>

      {/* Desktop */}
      <section className="hidden lg:flex flex-col justify-between h-full pb-6 border-r-slate-900">
        <img src={boatLogo} alt="boat-logo-full" />

        <nav className="mb-[200px] uppercase">
          <ul className="hidden lg:flex flex-col text-xl m-0 font-bold">
            {links.map(({ path, text }) => (
              <li key={text}>
                <NavLink to={path} className="block text-center py-3">
                  {text}
                </NavLink>
              </li>
            ))}
            {user && (
              <li className="text-center py-6">
                Hi
                {' '}
                {user.name}
                !
                {' | '}
                <Logout />
              </li>
            )}
          </ul>
        </nav>

        <div>
          <div className="flex justify-center space-x-4 py-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://plus.google.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Plus"
            >
              <FaGooglePlus />
            </a>
            <a
              href="https://vimeo.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vimeo"
            >
              <FaVimeoV />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
            >
              <FaPinterest />
            </a>
          </div>
          <p className="text-xs text-center">&copy; 2023 Boats</p>
        </div>
      </section>
    </header>
  );
};

export default Header;
