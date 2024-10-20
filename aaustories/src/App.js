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

const AppContent = () => {
 
  return (
    <>
     
     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/linkup" element={<LinkUp />} />
          <Route path="/upload" element={<CreateUser />} />
          <Route path="/comfession" element={<Comfession />} />
          <Route path="/confession/:id" element={<FullConfession />} />
          <Route path="/question/:id" element={<QuestionDetails />} />
          <Route path="/memes" element={<Memes />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      <Footer/>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
