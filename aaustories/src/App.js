import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Loader from './Pages/Loader'; // Import the Loader component
import Home from './Container/Home/Home'; // Example of your home component
import LinkUp from './Container/LinkUp/LinkUp'; // Example of another component
import { motion } from 'framer-motion';
import './App.css';
import Comfession from './Container/Comfession/Comfession';
import Memes from './Container/Memes/Memes';
import Donation from './Container/Donation/Donation';
import CreateUser from './Container/Upload/Upload';
import FullConfession from './Container/Comfession/Confession[';
import Footer from './Container/Footer/Footer';
import Admin from './Container/Admin/Admin';
import QuestionDetails from './Container/Home/Question';
import Blog from './Container/Blog/Blog';
import PostQuestion from './Container/Admin/PostQuestion/PostQuestion';
import CreateBlog from './Container/Blog/CreateBlog';
import AllBlogs from './Container/Admin/AllBlog/AllBlogs';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminLogin from './Container/Admin/AdminLogin';
import AdminHome from './Container/Admin/AdminHome';
import ChatComponent from './Container/Admin/AdminChat';

const App = () => {
 
  return (
    <Router>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/linkup" element={<LinkUp />} />
    <Route path="/upload" element={<CreateUser />} />
    <Route path="/comfession" element={<Comfession />} />
    <Route path="/confession/:id" element={<FullConfession />} />
    <Route path="/question/:id" element={<QuestionDetails />} />
    <Route path="/memes" element={<Memes />} />
    <Route path="/donation" element={<Donation />} />
    <Route path="/admin/*" element={<AdminLayout />} />
    <Route path="/admin/login" element={<AdminLogin />} />

  </Routes>
  <Footer/>
  </Router>
  );
};

const AdminLayout = () => (
  <ProtectedRoute>
  <Admin>
    <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="create-blog" element={<CreateBlog />} />
      <Route path="question" element={<PostQuestion />} />
      <Route path="all-blog-posted" element={<AllBlogs />} />
      <Route path="chat" element={<ChatComponent />} />
    </Routes>
  </Admin>
  </ProtectedRoute>
)
export default App;
