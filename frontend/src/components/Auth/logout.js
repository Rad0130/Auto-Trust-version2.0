import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Clear user data
    navigate('/'); // Redirect to home
  }, [logout, navigate]);

  return null; // No UI needed
};

export default Logout;