import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MailCheck, Lock, User, Phone, Image as ImageIcon,
  BadgeCheck, Eye, EyeOff
} from 'lucide-react';
import '../index.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (isOtpSent && isOtpButtonDisabled) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsOtpButtonDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, isOtpButtonDisabled]);

  useEffect(() => {
    const evaluateStrength = (pass) => {
      if (pass.length >= 8 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
        setPasswordStrength('Strong');
      } else if (pass.length >= 6 && /[A-Z]/.test(pass) && /[a-z]/.test(pass)) {
        setPasswordStrength('Moderate');
      } else {
        setPasswordStrength('Weak');
      }
    };
    evaluateStrength(password);
  }, [password]);

  const handleGetOtp = async () => {
    if (!email) {
      setMessage('📧 Email is required to send OTP.');
      return;
    }
    setIsSendingOtp(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsOtpSent(true);
        setIsOtpButtonDisabled(true);
        setTimer(60);
        setMessage(data.message);
      } else {
        setMessage(data.message || '❌ Failed to send OTP.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!otp || !email || !fullName || !studentId || !password || !phone || !profilePicture) {
      setMessage('⚠️ All fields and OTP are required.');
      return;
    }
    setIsVerifyingOtp(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', otp);
      formData.append('fullName', fullName);
      formData.append('studentId', studentId);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('profilePicture', profilePicture);

      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setIsRegistered(true);
        setTimeout(() => {
          setEmail('');
          setFullName('');
          setStudentId('');
          setPassword('');
          setPhone('');
          setProfilePicture(null);
          setOtp('');
          setIsOtpSent(false);
          setMessage('');
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center mb-8 text-blue-700"
        >
          Create Your Account
        </motion.h2>

        {!isRegistered && (
          <form onSubmit={handleRegister} className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Full Name" value={fullName} setValue={setFullName} icon={<User className="mr-2" size={18} />} />
                <InputField label="Student ID" value={studentId} setValue={setStudentId} icon={<BadgeCheck className="mr-2" size={18} />} />
                <InputField label="Email" type="email" value={email} setValue={setEmail} icon={<MailCheck className="mr-2" size={18} />} />
                <InputField label="Phone" value={phone} setValue={setPhone} icon={<Phone className="mr-2" size={18} />} />
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <div className="flex items-center border rounded px-3 py-2 shadow-sm bg-gray-50">
                    <Lock className="mr-2" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent outline-none"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-gray-500">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password && (
                    <div className={`mt-1 text-sm ${
                      passwordStrength === 'Strong' ? 'text-green-600' :
                      passwordStrength === 'Moderate' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      Your Password Strength is {passwordStrength}
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Upload Profile Picture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileInput label="Profile Picture" setFile={setProfilePicture} icon={<ImageIcon className="mr-2" size={18} />} />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Email Verification</h3>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGetOtp}
                  disabled={isOtpButtonDisabled || isSendingOtp}
                  className="btn-primary w-full"
                >
                  {isSendingOtp
                    ? 'Sending OTP...'
                    : isOtpSent
                      ? isOtpButtonDisabled
                        ? `Resend OTP in ${timer}s`
                        : 'Resend OTP'
                      : 'Send OTP'}
                </button>

                {isOtpSent && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="input-style"
                      required
                    />
                  </div>
                )}
              </div>
            </motion.section>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!isOtpSent || isVerifyingOtp}
              className="btn-secondary w-full"
            >
              {isVerifyingOtp ? 'Processing...' : 'Register'}
            </motion.button>
          </form>
        )}

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center text-sm mt-4 ${
              message.includes('success') || message.includes('✅') ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {message}
          </motion.p>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Have an account?</p>
          <Link to="/login" className="text-blue-500 hover:underline">Login Here</Link>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, value, setValue, type = 'text', icon }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="flex items-center border rounded px-3 py-2 shadow-sm bg-gray-50">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent outline-none"
        required
      />
    </div>
  </div>
);

const FileInput = ({ label, setFile, icon }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="flex items-center border rounded px-3 py-2 shadow-sm bg-gray-50">
      {icon}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full bg-transparent outline-none"
        required
      />
    </div>
  </div>
);

export default Register;
