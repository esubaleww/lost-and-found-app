import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Resetting password...');
    try {
      const res = await fetch('http://localhost:5000/api/password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (res.ok){ 
        toast.success(data.message);
        navigate('/login');
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
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-3 border rounded-md"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-3 border rounded-md"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
