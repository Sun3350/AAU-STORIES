import React, { useState, useEffect } from 'react';
import axios from 'axios';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
const FullConfession = () => {
  const [confession, setConfession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tex, setTex] = useState(''); // Text state for the comment input
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to show/hide emoji picker

  // Function to manually extract confessionId from the URL
  const getConfessionIdFromPath = () => {
    const pathnameArray = window.location.pathname.split('/');
    return pathnameArray[pathnameArray.length - 1]; // The last part of the URL
  };

  // Fetch confession from the backend
  const fetchConfession = async () => {
    const confessionId = getConfessionIdFromPath(); // Get the confessionId
    try {
      const response = await axios.get(`http://localhost:5000/api/users/confession/${confessionId}`);
      setConfession(response.data);
    } catch (error) {
      console.error('Error fetching confession:', error);
      setError('Could not fetch confession. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError(null); // Reset comment error state

    const confessionId = getConfessionIdFromPath(); // Manually get confessionId again

    try {
      await axios.post(
        `http://localhost:5000/api/users/confessions/${confessionId}/confession-comment`,
        { tex } // Sending the comment data with emoji support
      );
      setTex(''); // Clear the input field after submission
      fetchConfession(); // Refetch the confession to get the latest comments
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError('Could not add your comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle adding emoji to the input

  const addEmoji = (emoji) => {
    // Append the selected emoji to the current text
    setTex((prevText) => prevText + emoji.native);
  };

  useEffect(() => {
    fetchConfession();
  }, []); // Only run once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Confession Details</h1>
      <p>{confession.text}</p>
      
      <form onSubmit={handleCommentSubmit}>
        <input
          value={tex}
          onChange={(e) => setTex(e.target.value)}
          placeholder="Add a comment..."
          required
          rows={3}
        />

        {/* Button to toggle emoji picker */}
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {showEmojiPicker ? 'Hide Emojis' : 'Add Emoji'}
        </button>

        {/* Show Emoji Picker when the button is clicked */}
        {showEmojiPicker && <Picker data={data} onSelect={addEmoji} />}

        <button type="submit" disabled={commentLoading}>Comment</button>
      </form>

      {commentLoading && <p>Adding comment...</p>}
      {commentError && <p>{commentError}</p>}

      {confession.comments && confession.comments.length > 0 ? (
        confession.comments.map((comment) => (
          <p key={comment._id}>Comment: {comment.tex}</p> // Use comment ID as key if available
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default FullConfession;
