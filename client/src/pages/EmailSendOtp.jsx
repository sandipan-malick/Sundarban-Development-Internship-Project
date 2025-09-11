import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmailSendOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state; 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasSentOtp = useRef(false); 

  useEffect(() => {
    const sendOtp = async () => {
      try {
        const res = await axios.post('https://sundarban-development-internship-project.onrender.com/api/user/send-otp', {
          email: userData.email,
        });

        console.log('OTP sent:', res.data.message);
        setLoading(false);

        // Navigate to OTP verification page
        navigate('/registration/email/otp-verify', { state: userData });
      } catch (err) {
        console.error('OTP send error:', err);
        setLoading(false);
        setError(err.response?.data?.error || 'Failed to send OTP');
      }
    };

    if (userData?.email && !hasSentOtp.current) {
      hasSentOtp.current = true; 
      sendOtp();
    } else if (!userData?.email) {
      navigate('/registerPage');
    }
  }, [userData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-800">
      <div className="w-full max-w-md p-8 text-white rounded-lg shadow-lg bg-zinc-900">
        {loading ? (
          <p className="text-center text-blue-400">Sending OTP to your email...</p>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : null}
      </div>
    </div>
  );
}

export default EmailSendOtp;
