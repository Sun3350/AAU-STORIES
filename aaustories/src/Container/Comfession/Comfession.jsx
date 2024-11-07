import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './comfession.css';
import logo from '../../Images/Logo.png';
import { useNavigate } from 'react-router-dom';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmblaCarousel from './EmblaCarousel';

const Comfession = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [searchDone, setSearchDone] = useState(true);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts

    try {
      await axios.post('https://aau-stories-sever.vercel.app/api/users/submit-comfession', { text });
      setLoading(false); // Set loading to false when submission is done
      setShowPopup(false); // Hide the popup on successful submission
      setText(''); // Clear the text field
    } catch (error) {
      console.error('Error submitting confession:', error);
      setLoading(false); // Ensure loading is set to false on error
    }
  };

  // Slide-up animation for the popup
  const popupVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 70, damping: 12, duration: 0.8 }
    },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.5 } }
  };

  // Variants for animating the carousel
  const carouselVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, type: 'spring', stiffness: 50, damping: 15 }
    }
  };

  // Variants for animating the form elements
  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="comfession-page">
      {/* Header section */}
      <motion.div
        className="header w-full flex justify-between items-center"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.6 } }}
      >
        <a className="text-[#ffffff] font-bold" href="/">Close</a>
        {searchDone && (
          <motion.button
            className="header-button bg-[#ffff] text-[#015daa] font-bold"
            onClick={() => setShowPopup(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Talk
          </motion.button>
        )}
      </motion.div>

      {/* Popup confession form */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="comfession-popup flex flex-col justify-between items-center"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex w-full justify-end mr-8">
              <FontAwesomeIcon
                onClick={() => setShowPopup(false)}
                className="text-3xl cursor-pointer text-[#105daa]"
                icon={faTimes}
              />
            </div>
            <img src={logo} className="logo" alt="Logo" />
            <h2 className='text-center'>Tell it to us (Strictly Anonymous)</h2>
            <motion.div
              className="input-container h-full w-full max-w-md sm:p-8 lg:p-5"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <form onSubmit={handleSubmit} className="w-full text-lg font-medium text-gray-700">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Submit your confession..."
                  required
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
                />
                <motion.button
                  type="submit"
                  className="w-full p-3 bg-[#015daa] text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                  whileHover={{ scale: 1.05 }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loader">loading...</span> // Add your loading spinner class here
                  ) : (
                    'Confess'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main confession content */}
      <motion.div
        className="comfession w-full flex justify-center items-center flex-col"
        variants={carouselVariants}
        initial="hidden"
        animate="visible"
      >
        <img src={logo} className="logo w-24 h-24" alt="Logo" />
        <EmblaCarousel />
      </motion.div>
    </div>
  );
};

export default Comfession;
