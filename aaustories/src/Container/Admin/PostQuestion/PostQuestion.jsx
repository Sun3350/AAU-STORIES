// src/components/PostQuestion.js
import React, { useState } from 'react';
import axios from 'axios';
import'./postQuestion.css'

const PostQuestion = () => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/topics', { content });
     setContent(response.data);
     
      setContent('');
    } catch (error) {
      console.error('Error submitting topic:', error);
    }
  };

  return (
    <div className='w-full flex justify-center items-center bg-[#105daa] post-question'>
    <form onSubmit={handleSubmit} className='flex flex-col '>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        required
      />
      <button type="submit">Post Topic</button>
    </form>
    </div>
  );
};

export default PostQuestion;
