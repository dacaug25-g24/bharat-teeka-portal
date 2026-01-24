import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/registration/create-account');
  }, [navigate]);
  
  return (
    <div className="register-redirect d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="spinner-border text-teal" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-teal fw-semibold">Redirecting to registration page...</p>
    </div>
  );
}