// src/components/PostQuestion.js
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import'./postQuestion.css'
import logo  from '../../../Images/Logo.png'

const PostQuestion = () => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://aau-stories-sever.vercel.app/api/users/topics', { content });
     setContent(response.data);
     
      setContent('');
    } catch (error) {
      console.error('Error submitting topic:', error);
    }
  };

  const logoVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 10, duration: 0.8 }
    }
  };
  return (
    <div className='w-full flex justify-center flex-col items-center post-question'>
       <motion.img
            className='logo'
            src={logo}
            alt='Logo'
            variants={logoVariants}
            initial='hidden'
            animate='visible'
          />

    <form onSubmit={handleSubmit} className='flex flex-col w-[100%] justify-center items-center'>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        required
        className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
        />
      <button type="submit" className='bg-[#105daa] rounded p-5  w-[100%] mt-5'>Post Topic</button>
    </form>
    </div>
  );
};

export default PostQuestion;
