import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, selectToken } from '../redux/auth/authSlice.js';

const AuthChecker = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  useEffect(() => {
    // If we have a token in localStorage, try to get the current user
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return children;
};

export default AuthChecker;
