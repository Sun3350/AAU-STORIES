import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './home.css';
import logo from '../../Images/Logo.png';

const Home = () => {
  // Animation variants for the logo and buttons
  const logoVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 10, duration: 0.8 }
    }
  };

  const buttonVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.2, type: 'spring', stiffness: 50, damping: 10 }
    })
  };

  const buttons = [
    { text: 'Link Up', color: 'bg-rose-600 link-up', link: '/linkup' }, // Add links
    { text: 'Comfession', color: 'bg-black comfess', link: '/comfession' },
    { text: 'Memes', color: 'bg-blue-700 memes', link: '/memes' },
    { text: 'Donation', color: 'bg-red-700 donation', link: '/donation' }
  ];

  return (
    <div className='w-full home-container'>
      <div className='w-full flex flex-col justify-center items-center'>
        {/* Logo animation */}
        <motion.img
          className='logo'
          src={logo}
          alt='Logo'
          variants={logoVariants}
          initial='hidden'
          animate='visible'
        />
        <div className='buttons flex flex-col'>
          {/* Button animations with navigation links */}
          {buttons.map((button, index) => (
            <motion.button
              key={index}
              className={button.color}
              custom={index}
              variants={buttonVariants}
              initial='hidden'
              animate='visible'
            >
              <Link to={button.link} className="button-link">
                {button.text}
              </Link>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
