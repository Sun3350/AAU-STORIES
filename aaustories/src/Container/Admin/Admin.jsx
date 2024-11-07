import React, { useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import profile from '../../Images/profile.png';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaCog, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import './admin.css';
import { CiLogout } from "react-icons/ci";

import Blog from '../Blog/Blog';
import { useDispatch } from 'react-redux';
import { logout } from '../../utils/authSlice';
import { useNavigate } from 'react-router-dom';
import AdminHome from './AdminHome';

const Admin = ({ children }) => {  // Add children to function parameters
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const sidebarItems = [
    { path: '/blog', name: 'Home', icon: <FaHome /> },
    { path: '/admin/create-blog', name: 'Post Blog', icon: <FaUser /> },
    { path: '/admin/question', name: 'Post Question', icon: <FaCog /> },
    { path: '/admin/all-blog-posted', name: 'All Blogs', icon: <FaCog /> }
  ];

  const sidebarVariant = {
    hidden: { x: -100, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  const contentVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  // Default content for the admin dashboard
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/blog');
  };

  return (
    <div>
      <div className='header w-full flex justify-between items-center bg-[#105daa]'>
        <a className='text-[#ffffff] font-bold' href="/">Admin Dashboard</a>
        <div className='flex justify-center items-center'>
          <div className='text-white mr-5'><IoSettingsOutline /></div>
          <div className='w-8 h-8'><img src={profile} alt="" className='w-full h-full rounded' /></div>
        </div>
      </div>    

      <div className='dashboard-container'>
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {window.innerWidth > 660 && (
            <div className="sidebar-toggle" onClick={toggleSidebar}>
              {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
            </div>
          )}
          
          <ul>
            {sidebarItems.map((item, index) => (
              <motion.li
                key={item.name}
                custom={index}
                variants={sidebarVariant}
                initial="hidden"
                animate="visible"
                className={location.pathname === item.path ? 'active' : ''}
              >
                <Link to={item.path}>
                  {item.icon}
                  {isExpanded && <motion.span>{item.name}</motion.span>}
                </Link>
              </motion.li>
            ))}
          </ul>
            <motion.li 
            variants={sidebarVariant}
            initial="hidden"
            animate="visible"
            >
              <div onClick={handleLogout} className='font-bold text-1xl'> 
                <CiLogout className='font-bold text-2xl'/>{isExpanded && <motion.span>Logout</motion.span>}
              </div>
            </motion.li>
        </div>

        <AnimatePresence>
          <motion.div
            className="content"
            key={location.pathname}  
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariant}
          >
            {/* Render DefaultContent if no children are provided */}
            {location.pathname === '/admin' || !children ? <AdminHome /> : children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
