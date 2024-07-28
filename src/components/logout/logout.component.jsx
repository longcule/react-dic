import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('loginInfo');
    navigate('/login');
  }, [navigate]); // The empty array ensures this effect only runs once on mount

  // Render nothing or a spinner/loader if you want
  return null;
};

export default Logout;
