import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../Images/Logo.png';
import { FaShare } from "react-icons/fa";


const FullConfession = () => {
  const [confession, setConfession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tex, setTex] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const fetchConfession = async () => {
    const confessionId = window.location.pathname.split('/').pop();
    try {
      const response = await axios.get(`http://localhost:5000/api/users/confession/${confessionId}`);
      setConfession(response.data);
    } catch (error) {
      setError('Could not fetch confession. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    const confessionId = window.location.pathname.split('/').pop();

    try {
      await axios.post(
        `http://localhost:5000/api/users/confessions/${confessionId}/confession-comment`,
        { tex }
      );
      setTex('');
      fetchConfession();
    } catch (error) {
      setCommentError('Could not add your comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    fetchConfession();
  }, []);

  const navigate = useNavigate();
  
  const handleNavigation = () => {
    navigate('/comfession');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this confession!',
          text: confession.text,
          url: window.location.href, // Share current page URL
        });
        console.log('Confession shared successfully!');
      } catch (error) {
        console.error('Error sharing confession:', error);
      }
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='single-main-confession-container'>
      <motion.div
        className="header w-full flex justify-between items-center"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.6 } }}
      >
        <a className="text-[#ffffff] font-bold" href="/">Close</a>
       
        <motion.button
          className="header-button bg-[#ffff] text-[#015daa] font-bold"
          onClick={handleNavigation}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Talk
        </motion.button>
      </motion.div>

      <div className='single-confession-container'>
        <motion.div
          className='confession-container'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img className='logo' src={logo} alt="" />
          <div className='w-full text-white border border-white p-5 rounded-md mt-5'>
            <p>{confession.text}</p>
          </div>
          
          {/* Share Button */}
        
        </motion.div>
      
        {/* Comment Section */}
        <motion.div
          className='comment-section sticky-comment'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <form onSubmit={handleCommentSubmit} className='flex w-full mb-10'>
            <textarea
              value={tex}
              onChange={(e) => setTex(e.target.value)}
              placeholder="Add a comment..."
              required
              rows={3}
              className='comment-input'
            />
            <button type="submit" disabled={commentLoading}>Comment</button>
          </form>
        </motion.div>

        <motion.div
          className='comments-container'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {commentLoading && <p>Adding comment...</p>}
          {commentError && <p>{commentError}</p>}
          {confession.comments && confession.comments.length > 0 ? (
            confession.comments.map((comment) => (
              <div className='comments' key={comment._id}>
                <p>{comment.tex}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </motion.div>
      </div>
      <motion.button
            className="share-button fixed bottom-20 right-10 bg-white text-[#105daa] font-bold py-2 px-4 rounded mt-4"
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaShare />
          </motion.button>
    </div>
  );
};

export default FullConfession;