import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './home.css';
import logo from '../../Images/Logo.png';
import { FiSend } from "react-icons/fi";
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

  const textVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.3, type: 'spring', stiffness: 50, damping: 10 }
    })
  };

  const buttons = [
    { text: 'Link Up', color: 'bg-rose-600 link-up', link: '/linkup' }, // Add links
    { text: 'Comfession', color: 'bg-black comfess', link: '/comfession' },
    { text: 'Memes', color: 'bg-blue-700 memes', link: '/memes' },
    { text: 'Donation', color: 'bg-red-700 donation', link: '/donation' },
    { text: 'Admin', color: 'bg-blue-700 admin', link: '/admin' }
  ];

  const [questionComment, setQuestionComment] = useState('');
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate(); // React Router hook to navigate programmatically

  const fetchTopics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/get-topics');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleCommentSubmit = async (e, topicId) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/users/topics/${topicId}/comment`, { text:questionComment });
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
      <div className='w-full flex justify-center items-center home-container shadow-2xl'>
        <div className='first-home-container'>
          {/* Logo animation */}
          <motion.img
            className='logo'
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
          <div>
            {topics.map(({ _id, content }, index) => (
              <motion.div
                key={_id}
                className='flex flex-col items-center w-full'
                variants={textVariants}
                initial='hidden'
                animate='visible'
                custom={index + 1} // Start delay for each topic (1, 2, 3...)
              >
                <p className='mt-5 mb-4 text-2xl font-bold'>{content}</p>
                <form onSubmit={(e) => handleCommentSubmit(e, _id)} className='flex w-full justify-center items-center'>
                  <textarea
                    type="text"
                    value={questionComment}
                    onChange={(e) => setQuestionComment(e.target.value)}
                    placeholder="Add a comment..."
                    required
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
                  />
                  <button className='question-button text-3xl' type="submit">
                    <FiSend /> 
                  </button>
                </form>
                <button
                  className='bg-green-500  text-white px-4 py-2 mt-3 rounded-md'
                  onClick={() => handleViewComments(_id)} // Pass the topicId to view full question
                >
                  View Comments
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className='second-home-container'>
          <div className='buttons flex flex-col'>
            {buttons.map((button, index) => (
              <motion.button
                key={index}
                className={button.color}
                custom={index}
                variants={buttonVariants}
                initial='hidden'
                animate='visible'
              >
                <Link to={button.link} className="button-link">
                  {button.text}
                </Link>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
