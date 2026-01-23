import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new create-account page
    navigate('/create-account');
  }, [navigate]);
  
  return (
    <div className="text-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Redirecting to registration page...</p>
    </div>
  );
}