import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://aau-stories-sever.vercel.app/api/users/get-all-blog'); // Replace with your endpoint
        setBlogs(response.data);
        setFilteredBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = blogs.filter(blog =>
      blog.title.toLowerCase().includes(value) ||
      blog.author.toLowerCase().includes(value) ||
      blog.content.toLowerCase().includes(value)
    );
    setFilteredBlogs(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://aau-stories-sever.vercel.app/api/users/delete-blog/${id}`);
      setBlogs(blogs.filter(blog => blog.id !== id));
      setFilteredBlogs(filteredBlogs.filter(blog => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleEdit = (blog) => {
    navigate('/admin/create-blog', { state: { blog } });
  };

  return (
    <div className="w-full p-4">
      <input
        type="text"
        placeholder="Search by title, author, or content"
        value={searchTerm}
        onChange={handleSearch}
        className="p-2 mb-4 border border-gray-300 rounded w-full"
      />

      <div className="grid gap-4">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              className="p-4 border border-gray-300 rounded shadow-sm flex justify-between items-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }} // Delay each item slightly
            >
              <div>
                <h2 className="text-lg font-semibold">{blog.title}</h2>
                <p className="text-sm text-gray-500">by {blog.author}</p>
                <p className="mt-2 text-[#105daa]">{blog.content.substring(0, 100)}...</p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex space-x-2">
                <FaEdit onClick={() => handleEdit(blog)} className="text-blue-500 cursor-pointer" />
                <FaTrash onClick={() => handleDelete(blog.id)} className="text-red-500 cursor-pointer" />
              </div>
            </motion.div>
          ))
        ) : (
          <p>No blogs found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
