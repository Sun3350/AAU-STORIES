import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiSend } from "react-icons/fi"; // Import the icon
import { FiShare2 } from "react-icons/fi"; // Import the share icon
import { motion } from 'framer-motion';
import logo from '../../Images/Logo.png';

const QuestionDetails = () => {
  const { id } = useParams(); // Get the topicId from the URL
  const [topic, setTopic] = useState(null);
  const [newComment, setNewComment] = useState(''); // State for new comment

  // Fetch topic details including comments
  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await axios.get(`https://aau-stories-sever.vercel.app/api/users/topics/${id}`);
        setTopic(response.data);
      } catch (error) {
        console.error('Error fetching topic details:', error);
      }
    };
    fetchTopicDetails();
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/users/topics/${id}/comment`, { text: newComment });
      setNewComment(''); // Clear input after submission

      // Fetch updated topic details to reflect the new comment
     
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  // Function to handle sharing the topic URL
  const handleShare = async () => {
    const url = `${window.location.origin}/topics/${id}`; // Construct the URL
    try {
      await navigator.clipboard.writeText(url); // Copy the URL to clipboard
      alert('Link copied to clipboard!'); // Alert user
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!topic) return <div className='question-load'>Loading...</div>;

  return (
    <div className="question-main-container  ">
      
      <motion.div
        className="header w-full flex justify-between items-center"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.6 } }}
      >
        <a className="text-[#ffffff] font-bold" href="/">Close</a>
       
        <motion.button
          className="header-button bg-[#ffff] text-[#015daa] font-bold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Talk
        </motion.button>
      </motion.div>
      <div className='question-container'>
        <div className='question'>
        <img src={logo} alt="" className='logo'/>
        <div><h2 className="text-2xl text-center text-white font-bold my-4">{topic.content}</h2></div>
</div>
      <div className='question-comment-section sticky-question-comment'>
      

      {/* Add new comment form */}
      <form onSubmit={handleCommentSubmit} className="flex items-center mt-4   w-full mb-10">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="question-comment-input"
          required
        />
        <button type="submit" className="ml-2 text-xl p-2 bg-blue-500 text-white rounded-lg">
          <FiSend />
        </button>
      </form>
      <div className='question-comment-container'>
        {topic.comments.map((comment) => (
          <li key={comment._id} className="question-comments">
            {comment.text}
          </li>
        ))}
      </div>
      <button 
        onClick={handleShare} 
        className=" share-button  flex justify-center items-center  bg-white text-[#105daa] font-bold py-2 px-4 rounded mt-4"
      >
        <FiShare2 className="mr-2" />
        Share
      </button>
      </div>
      </div>
      
    </div>
  );
};

export default QuestionDetails;
