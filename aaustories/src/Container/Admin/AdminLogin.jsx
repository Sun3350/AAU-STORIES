// src/components/AdminLogin.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { loginUser } from '../../utils/authSlice';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './admin.css';
import logo from '../../Images/Logo.png'

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/admin');
        }, 2000);
      } else {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    });
  };

  if (isAuthenticated) navigate('/admin');

  return (
    <div className='w-full '>
         <div className='header w-full flex justify-between items-center bg-[#105daa]  '>
    <a className='text-[#ffffff] font-bold' href="/">Close</a> 
  
      <button 
        className='header-button bg-[#fff] text-[#105daa] font-bold' 
      >
        Change Location
      </button>
  </div>    
    <div className="login-container w-full">
       
      <AnimatePresence>
        {showToast && (
          <motion.div
            className={`toast ${error ? 'error-toast' : 'success-toast'}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {error || 'Login successful!'}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className='admin-login-form'>
        <motion.img
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          src={logo}
          style={{width:'30%'}}
       />
         
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <h2 className='text-[#105daa] mb-5 text-center'>Admin Login</h2>
        </motion.div>
        
        <motion.div
          className="input-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="styled-input"
          />
        </motion.div>

        <motion.div
          className="input-wrapper password-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
        >
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="styled-input"
          />
          <span onClick={() => setShowPassword(!showPassword)} className="toggle-password">
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeInOut' }}
          className={`submit-button ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </motion.button>
      </form>
    </div>
    </div>
  );
};

export default AdminLogin;
