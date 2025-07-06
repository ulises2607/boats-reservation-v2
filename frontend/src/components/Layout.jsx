import { Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import Header from './Header';

const Layout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    // Layout horizontal para landing page
    return (
      <section className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
          <Header />
        </header>
        
        <main className="pt-20">
          <Outlet />
        </main>
      </section>
    );
  }

  // Layout original para páginas internas
  return (
    <section className="flex flex-col lg:flex-row h-screen">
      <header className="lg:w-1/5 border-r border-slate-200">
        <Header />
      </header>

      <main className="w-full h-full">
        <Outlet />
      </main>
    </section>
  );
};

export default Layout;
