import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Sending OTP...');
    try {
      const res = await fetch('http://localhost:5000/api/password/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (res.ok){ toast.success(data.message);
        navigate('/reset-password');
      }
      else toast.error(data.message);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong.');
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Forgot Password</h2>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          >
            Send OTP
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
