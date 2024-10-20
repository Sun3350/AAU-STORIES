import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiSend } from "react-icons/fi"; // Import the icon
import { FiShare2 } from "react-icons/fi"; // Import the share icon

const QuestionDetails = () => {
  const { id } = useParams(); // Get the topicId from the URL
  const [topic, setTopic] = useState(null);
  const [newComment, setNewComment] = useState(''); // State for new comment

  // Fetch topic details including comments
  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/topics/${id}`);
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

  if (!topic) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{topic.content}</h2>

      {/* Share Button */}
      <button 
        onClick={handleShare} 
        className="mb-4 p-2 text-white bg-green-500 rounded-lg flex items-center"
      >
        <FiShare2 className="mr-2" />
        Share
      </button>

      {/* List of existing comments */}
      <ul>
        {topic.comments.map((comment) => (
          <li key={comment._id} className="border-b border-gray-200 py-2">
            {comment.text}
          </li>
        ))}
      </ul>

      {/* Add new comment form */}
      <form onSubmit={handleCommentSubmit} className="flex items-center mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <button type="submit" className="ml-2 text-xl p-2 bg-blue-500 text-white rounded-lg">
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default QuestionDetails;
