import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './home.css';
import logo from '../../Images/Logo.png';
import { FiSend } from "react-icons/fi";
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing icons from react-icons

import axios from 'axios';

const Home = () => {
  // Animation variants for the logo and buttons
  const logoVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 10, duration: 0.8 }
    }
  };

  const buttonVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.2, type: 'spring', stiffness: 50, damping: 10 }
    })
  };

  const navbarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      }
    }
  };

  

  const textVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.3, type: 'spring', stiffness: 50, damping: 10 }
    })
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const buttons = [
    { text: 'Blog', color: 'bg-rose-600 link-up', link: '/blog' }, // Add links
    { text: 'Link Up', color: 'bg-rose-600 link-up', link: '/linkup' }, // Add links
    { text: 'Comfession', color: 'bg-black comfess', link: '/comfession' },
    { text: 'Memes', color: 'bg-blue-700 memes', link: '/memes' },
    { text: 'Donation', color: 'bg-red-700 donation', link: '/donation' },
    { text: 'Admin', color: 'bg-blue-700 admin', link: '/admin' }
  ];

  const [questionComment, setQuestionComment] = useState('');
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate(); // React Router hook to navigate programmatically
  const [loading, setLoading] = useState(true); // Loading state

  const fetchTopics = async () => {
    try {
      const response = await axios.get('https://aau-stories-sever.vercel.app/api/users/get-topics');
      setTopics(response.data);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleCommentSubmit = async (e, topicId) => {
    e.preventDefault();
    try {
      await axios.post(`https://aau-stories-sever.vercel.app/api/users/topics/${topicId}/comment`, { text:questionComment });
      setQuestionComment('');
      fetchTopics(); // Fetch updated topics after submitting a comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Function to navigate to the full question page
  const handleViewComments = (topicId) => {
    navigate(`/question/${topicId}`); // Navigate to the full question page with topicId
  };

  useEffect(() => {
    fetchTopics();
  }, []); // Dependency array includes no dependencies, so it runs only once

  return (
    <div className='w-full home-main-container'>
     <div className="mobile-navbar">
      <button className="hamburger" onClick={() => setIsOpen(true)}>
        <FaBars />
      </button>
      <motion.div
        className={`navbar ${isOpen ? 'open' : ''}`}
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={navbarVariants}
      >
        <div onClick={() => setIsOpen(false)} className="close-icon text-white border-white">
          <FaTimes />
        </div>
        <ul>
          {buttons.map((button, index) => (
            <motion.li
              className="nav-li"
              key={index}
              variants={buttonVariants}
            >
              <a
                href={button.link}
                onClick={() => setIsOpen(false)}
                className="button-link"
              >
                {button.text}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
      <div className='w-full flex justify-center items-center home-container '>
        <div className='first-home-container p-6'>
          {/* Logo animation */}
          <motion.img
            className='home-logo'
            src={logo}
            alt='Logo'
            variants={logoVariants}
            initial='hidden'
            animate='visible'
          />

          {/* Question of the Day with animation */}
          <motion.h3
            className='question-title mt-3'
            variants={textVariants}
            initial='hidden'
            animate='visible'
            custom={0} // Animation delay 0
          >
            Question of the Day
          </motion.h3>

          {/* Topic content with staggered animation */}
          <div className='flex justify-center items-center  h-52 w-fit'>
      {loading ? (
        <p className="text-center text-xl font-bold">Loading...</p>
      ) : (
        topics.map(({ _id, content }, index) => (
          <motion.div
            key={_id}
            className="flex flex-col items-center w-full"
            variants={{ /* your animation variants here */ }}
            initial="hidden"
            animate="visible"
            custom={index + 1}
          >
            <p className="mt-5 mb-4 text-2xl font-bold text-center">{content}</p>
            <form onSubmit={(e) => handleCommentSubmit(e, _id)} className="flex w-full justify-center items-center">
              <textarea
                type="text"
                value={questionComment}
                onChange={(e) => setQuestionComment(e.target.value)}
                placeholder="Add a comment..."
                required
                className="question-comment-input"
              />
              <button className="question-button text-3xl" type="submit">
                <FiSend className='send'/>
              </button>
            </form>
            <button
              className="bg-green-500 text-white px-4 py-2 mt-3 rounded-md"
              onClick={() => handleViewComments(_id)}
            >
              View Comments
            </button>
          </motion.div>
        ))
      )}
    </div>
        </div>

        <div className='second-home-container'>
          <div className='buttons flex flex-wrap justify-center items-center'>
            {buttons.map((button, index) => (
               <a href={button.link} className="button-link">
             <motion.button
                key={index}
                className={button.color}
                custom={index}
                variants={buttonVariants}
                initial='hidden'
                animate='visible'
              >
                  {button.text}
              </motion.button>                
              </a>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
