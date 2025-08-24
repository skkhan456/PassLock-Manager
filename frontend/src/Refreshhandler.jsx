import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Refreshhandler = ({ setisAuthenticate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token=localStorage.getItem('token')
    if (token) {
      console.log(token)
      setisAuthenticate(true);

      if (
        location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/signup'
      ) {
        navigate('/home', { replace: false });
      }
    }

  }, [location, navigate, setisAuthenticate]);

  return(
    null
  ) ;
};

export default Refreshhandler;