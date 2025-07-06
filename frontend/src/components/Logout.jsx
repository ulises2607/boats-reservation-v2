import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/auth/authSlice.js';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      // Even if logout fails on server, we've cleared local state
      navigate('/');
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleLogout} 
      className="text-red-600 hover:text-red-800 font-medium"
    >
      Logout
    </button>
  );
};

export default Logout;
