import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './blog.css'
const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [blogImage, setBlogImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const blogData = location.state?.blog; // Retrieve blog data from location state if it exists

  useEffect(() => {
    if (blogData) {
      // Set initial values from blogData if editing an existing blog
      setTitle(blogData.title);
      setContent(blogData.content);
      setAuthor(blogData.author);
      setCategory(blogData.category);
      setImagePreview(blogData.blogImage);
    }
  }, [blogData]);

  const categoriesOptions = ['Fintech', 'Technology', 'Health', 'Education', 'Lifestyle', 'Other'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBlogImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blog = new FormData();
    blog.append('title', title);
    blog.append('content', content);
    blog.append('author', author);
    blog.append('categories', category);
    if (blogImage) {
      blog.append('image', blogImage);
    }

    try {
      if (blogData) {
        // Update existing blog
        await axios.put(`https://aau-stories-sever.vercel.app/api/users/update-blog/${blogData.id}`, blog, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new blog
        await axios.post('https://aau-stories-sever.vercel.app/api/users/create-blog', blog, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      navigate('/'); // Redirect to home after save
    } catch (error) {
      console.error('Error saving the blog:', error);
    }
  };

  return (
    <div className="w-full h-full py-10">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="flex mt-5">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categoriesOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <input
          type="file"
          onChange={handleImageChange}
          required={!blogData}
          className='mt-5' // Required only if creating a new blog
        />
        {imagePreview && (
          <div className="image-preview mx-5">
            <img src={imagePreview} alt="Blog Preview" style={{ width: '100%', height: 'auto' }} />
          </div>
        )}
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Content"
          required
          className='custom-quill'
        />
        <button className="p-2 bg-blue-600 text-white border mt-5 mb-10" type="submit">
          {blogData ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
