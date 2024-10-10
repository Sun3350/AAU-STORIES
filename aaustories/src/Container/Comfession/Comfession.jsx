import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './comfession.css';
import logo from '../../Images/Logo.png';
import { useNavigate } from 'react-router-dom';
import {faFacebook, faInstagram, faLocationDot, faPhone, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EmblaCarousel from './EmblaCarousel';


const Comfession = ({ onConfessionSubmitted }) => {
 
  const [showPopup, setShowPopup] = useState(false);
  const [searchDone, setSearchDone] = useState(true);

  const navigate = useNavigate();

  // Check localStorage on component mount for gender, location, and users
  
  const handleNavigation = () => {
    setShowPopup(true); // Show popup again when "Change Location" is clicked
  };

  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/submit-comfession', { text });
     // onConfessionSubmitted(response.data);
      setText('');
    } catch (error) {
      console.error('Error submitting confession:', error);
    }
  };

 
 

  // Slide up animation for the popup
  const popupVariants = {
    hidden: { y: '100%', opacity: 0 }, // Starts from below the screen
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 70, damping: 12, duration: 0.8 }
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Limit the description length
  const MAX_LENGTH = 100;

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const userCardContainerVariants = {
    hidden: { opacity: 0, y: 20 }, // Start off-screen and invisible
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Move to its original position
  };
  
  const userTextVariants = {
    hidden: { opacity: 0, y: 10 }, // Start slightly below and invisible
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Move to its original position
  };
  
  const userListVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 1, // Stagger effect for children
      },
    },
  };
  




return (
  <div className='comfession-page'>
  <div className='header w-full flex justify-between items-center'>
    <a className='text-[#ffffff] font-bold' href="/">Close</a> 
    {searchDone && (
      <button 
        className='header-button bg-[#ffff] text-[#015daa] font-bold' 
        onClick={handleNavigation}
      >
        Talk
      </button>
    )}
  </div>

  {showPopup && (
    <motion.div
      className='comfession-popup flex flex-col justify-between items-center'
      variants={popupVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
     
    >
      <div className='flex w-full justify-end mr-8'><FontAwesomeIcon  onClick={() => setShowPopup(false)} className='text-3xl cursor-pointer text-[#105daa]' icon={faTimes}/></div>
      <img src={logo} className='logo' alt="" />
      <h2>Tell it to us (Strictly Anonymouse)</h2>
      <div className='input-container h-full w-full max-w-md sm:p-8 lg:p-5'>
       
        <form onSubmit={handleSubmit} className='w-full text-lg font-medium text-gray-700'>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Submit your confession..."
        required
        className='w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none'

      />
     <button 
          type='submit'
          className='w-full p-3 bg-[#015daa] text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition'>
          Comfess
        </button>
    </form>

        
      </div>
    </motion.div>

          )}
        <div  
        className=' comfession w-full flex justify-center items-center flex-col'>
                <img src={logo} className='logo w-24 h-24' alt="" />

        <EmblaCarousel  />

        </div>
     
 
</div>

  );
};

export default Comfession;
