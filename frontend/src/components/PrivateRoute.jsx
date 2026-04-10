import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem('token');
  const { userData } = useAppContext();

  if (!token) {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  // If roles are specified, check if user has permission
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userData.role) {
      // Data might still be loading from context
      return <div className='p-8'>Verifying permissions...</div>;
    }

    if (!allowedRoles.includes(userData.role)) {
      toast.error('You do not have permission to access this page');
      return (
        <Navigate
          to='/'
          replace
        />
      );
    }
  }

  return children;
};

export default PrivateRoute;
