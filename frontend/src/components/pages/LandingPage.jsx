import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiShield, FiClock } from 'react-icons/fi';
import { FaAnchor, FaShip, FaFish } from 'react-icons/fa';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Encuentra tu <span className="text-blue-200">Aventura</span> Perfecta
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Alquila botes, equipos de pesca y vive experiencias únicas en el agua. 
            La plataforma más confiable para aventuras náuticas.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center bg-gray-50 rounded-lg p-3">
                <FiMapPin className="text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="¿Dónde quieres navegar?"
                  className="bg-transparent text-gray-800 w-full focus:outline-none"
                />
              </div>
              <div className="flex items-center bg-gray-50 rounded-lg p-3">
                <FaAnchor className="text-gray-400 mr-2" />
                <select className="bg-transparent text-gray-800 w-full focus:outline-none">
                  <option>Tipo de bote</option>
                  <option>Lancha deportiva</option>
                  <option>Velero</option>
                  <option>Yate</option>
                  <option>Bote de pesca</option>
                </select>
              </div>
              <div className="flex items-center bg-gray-50 rounded-lg p-3">
                <FiClock className="text-gray-400 mr-2" />
                <input 
                  type="date" 
                  className="bg-transparent text-gray-800 w-full focus:outline-none"
                />
              </div>
              <Link 
                to="/boats"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiSearch className="mr-2" />
                Buscar
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <FaShip className="text-6xl animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <FaFish className="text-4xl animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            ¿Por qué elegir nuestra plataforma?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Totalmente Seguro</h3>
              <p className="text-gray-600">
                Todos los botes están verificados y cuentan con seguros. Tu seguridad es nuestra prioridad.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mejor Experiencia</h3>
              <p className="text-gray-600">
                Reseñas reales, propietarios verificados y el mejor servicio al cliente del mercado.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reserva Inmediata</h3>
              <p className="text-gray-600">
                Reserva en minutos con confirmación instantánea. ¡Tu aventura te espera!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Explora por categoría
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <FaShip className="text-6xl text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">Veleros</h3>
              </div>
            </div>
            
            <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <FaAnchor className="text-6xl text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">Lanchas</h3>
              </div>
            </div>
            
            <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <FaFish className="text-6xl text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">Pesca</h3>
              </div>
            </div>
            
            <div className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <FiStar className="text-6xl text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">Lujo</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Botes Disponibles</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">2K+</div>
              <div className="text-blue-200">Clientes Felices</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Destinos</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.9</div>
              <div className="text-blue-200">Rating Promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de aventureros que ya descubrieron la libertad del mar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Comenzar Ahora
            </Link>
            <Link 
              to="/boats"
              className="border border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Explorar Botes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
