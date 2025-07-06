import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/usersession/usersessionsSlice';

function Reserve() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    // Redirigir a la página de exploración de botes donde pueden seleccionar uno para reservar
    navigate('/boats');
  }, [navigate]);

  if (!user) {
    return (
      <section className="h-full flex justify-center items-center">
        <article className="flex flex-col gap-4 border border-slate-950 rounded-md p-4 mx-auto max-w-xs lg:max-w-lg">
          <h2 className="font-black uppercase text-4xl text-center">Access Denied</h2>
          <p className="text-center text-md">Please log in first to make a reservation.</p>
        </article>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h2>
        <p className="text-gray-600">Taking you to browse available boats...</p>
      </div>
    </div>
  );
}

export default Reserve;
