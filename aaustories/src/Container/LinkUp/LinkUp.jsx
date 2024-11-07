import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './linkUp.css';
import logo from '../../Images/Logo.png';
import { useNavigate } from 'react-router-dom';
import {faFacebook, faInstagram, faLocationDot, faPhone, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaFacebook,  FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
const statesOfNigeria = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]; 

const LinkUp = (props) => {
 const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [searchDone, setSearchDone] = useState(false);

  const navigate = useNavigate();

  // Check localStorage on component mount for gender, location, and users
  useEffect(() => {
    const genderStored = localStorage.getItem('gender');
    const locationStored = localStorage.getItem('location');
    const usersStored = localStorage.getItem('users'); // Get saved users

    if (genderStored && locationStored && usersStored) {
      setGender(genderStored);
      setLocation(locationStored);
      setUsers(JSON.parse(usersStored)); // Parse users from localStorage
      setShowPopup(false); // Don't show popup if gender and location already set
      setSearchDone(true); // Mark search as done
    }
  }, []);

  const handleNavigation = () => {
    setShowPopup(true); // Show popup again when "Change Location" is clicked
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('https://aau-stories-sever.vercel.app/api/users/search', { 
        gender: gender.toLowerCase(), 
        location: location.toLowerCase() 
      });
      console.log('API response:', response.data);  // Log the response to inspect the data
      setUsers(response.data);  // Assuming response.data is an array of users

      // Store gender, location, and users in localStorage
      localStorage.setItem('gender', gender);
      localStorage.setItem('location', location);
      localStorage.setItem('users', JSON.stringify(response.data)); // Save users as string in localStorage

      setShowPopup(false);  // Close popup after search
      setSearchDone(true);  // Mark search as completed
    } catch (error) {
      console.error('Error searching for users:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error searching for users');
    }
  };

  // Slide up animation for the popup
  const popupVariants = {
    hidden: { y: '100%', opacity: 0 }, // Starts from below the screen
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 70, damping: 12, duration: 0.8 }
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Limit the description length
  const MAX_LENGTH = 100;

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  const userCardContainerVariants = {
    hidden: { opacity: 0, y: 20 }, // Start off-screen and invisible
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Move to its original position
  };
  
  const userTextVariants = {
    hidden: { opacity: 0, y: 10 }, // Start slightly below and invisible
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Move to its original position
  };
  
  const userListVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 1, // Stagger effect for children
      },
    },
  };
  const [socialExpanded, setSocialExpanded] = useState(false);

  const handleToggle = () => {
    setSocialExpanded(prev => !prev);
  };

const [details, setDetails] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState(null);

const { slides, options } = props
const [emblaRef, emblaApi, embla] = useEmblaCarousel(options)

const { selectedIndex, scrollSnaps, onDotButtonClick } =
  useDotButton(emblaApi)

const {
  prevBtnDisabled,
  nextBtnDisabled,
  onPrevButtonClick,
  onNextButtonClick
} = usePrevNextButtons(emblaApi)


useEffect(() => {
  if (embla) {
    embla.on('select', () => {
      const selectedIndex = embla.selectedScrollSnap();
      const selectedUser = users[selectedIndex];
      const userId = users._id;
console.log(users._id)
      const selectedUserId = selectedUser._id; // Change this to _id if necessary
      window.history.pushState({}, '', `/linkup/${userId}`);
      setSelectedUserId(selectedUserId);
      
    });
  }
}, [embla, users]);

return (
  <div className='linkup-page'>
  <div className='header w-full flex justify-between items-center'>
    <a className='text-[#ffffff] font-bold' href="/">Close</a> 
    {searchDone && (
      <button 
        className='header-button bg-[#fff] text-[#105daa] font-bold' 
        onClick={handleNavigation}
      >
        Change Location
      </button>
    )}
  </div>

  {showPopup ? (
    <motion.div
      className='popup flex flex-col justify-between items-center'
      variants={popupVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
    >
      <img src={logo} className='logo' alt="" />
      <h2>Link Up With Your Spec</h2>
      <div className='input-container h-full w-full max-w-md sm:p-8 lg:p-5'>
        <label className='w-full text-lg font-medium text-gray-700'>
          Gender:
          <select 
            value={gender} 
            onChange={(e) => setGender(e.target.value)} 
            className='w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none'>
            <option value=''>Select Gender</option>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </select>
        </label>

        <label className='w-full text-lg font-medium text-gray-700'>
          Location:
          <select 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            className='w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none'>
            <option value=''>Select State</option>
            {statesOfNigeria.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
        </label>

        <button 
          onClick={handleSearch} 
          className='w-full p-3 bg-[#015daa] text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition'>
          Search
        </button>
      </div>
    </motion.div>
  ) : (
   <div className='flex'>
    <div className="embla__controls">
            <div className="embla__buttons">
              <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            </div>

          
          </div>
 
      <div className='embla'>
      <div className=" user-list embla__viewport" ref={emblaRef}>
          <motion.div className="embla__container "
          initial='hidden' 
          animate='visible' 
          variants={userListVariants}>

            {users.map((user) => (
              <motion.div
                key={user._id}
                className='user-card embla__slide'
                variants={userCardContainerVariants}
              >
                 <div className='relative w-full h-full'>
                  
                    <img 
                      className='user-image' 
                      src={user.image} 
                      alt="" 
                      onDoubleClick={() => setDetails(true)} 
                    />
                    {details && (
                      <div className='absolute user-details' onDoubleClick={() => setDetails(false)}>
                        <div className='w-96'>
                          <motion.div variants={userTextVariants}>
                            <div className='mb-3'>
                              <h3>{user.name}</h3>
                            </div>
                          </motion.div>
                          <motion.div variants={userTextVariants}>
                            <div className='flex w-full text-center h-8 text-white'>
                              <FontAwesomeIcon className='icon' icon={faLocationDot} />
                              <p>{user.location}</p>
                            </div>
                          </motion.div>
                          <motion.div variants={userTextVariants}>
                            <div 
                              className='flex cursor-pointer w-full text-center h-8 text-white' 
                            
                              onClick={() =>{ navigator.clipboard.writeText(user.contact).then(() => {
                                alert('Phone Number copied to clipboard!');
                              })}}
                            >
                              <FontAwesomeIcon className='icon' icon={faPhone} />
                              <p>{user.contact}</p>
                            </div>
                          </motion.div>
  
                          <div className='description'>
                            <p>{isExpanded ? user.desc : `${user.desc.slice(0, MAX_LENGTH)}...`}</p>
                            <button 
                              className='text-blue-500 font-semibold' 
                              onClick={toggleDescription}
                            >
                              {isExpanded ? 'Hide' : 'See More'}
                            </button>
                          </div>
  
                        
                        
                        </div>
                        <div 
                            className={`w-20 h-20 flex justify-center items-center cursor-pointer ${isExpanded ? 'expanded' : ''}`} 
                            onClick={handleToggle}
                          >
                            {socialExpanded && (
                              <div className='expanded-containers'>
                                <div className='expanded-container' onClick={() => {
                                  navigator.clipboard.writeText(user.whatsappNumber).then(() => {
                                    alert('WhatsApp number copied to clipboard!');
                                  })
                                }}>
                                  <FaWhatsapp className='container-icon' />
                                </div>
                                <div className='expanded-container'>
                                  <a href={user.instagramLink} target="_blank" rel="noopener noreferrer">
                                    <FaInstagram className='container-icon' />
                                  </a>
                                </div>
                                <div className='expanded-container'>
                                  <a href={user.facebookLink} target="_blank" rel="noopener noreferrer">
                                    <FaFacebook className='container-icon' />
                                  </a>
                                </div>
                               
                              </div>
                            )}
                            <div className={`social-container ${socialExpanded ? 'rotate-icon' : ''}`}>
                              <FontAwesomeIcon className='social-icon' icon={faPlus} />
                            </div>
                          </div>
                      </div>
                    )}
                  </div>
              </motion.div>
            ))}

          </motion.div>
          
        </div>
       
        </div> <div className="embla__controls">
            <div className="embla__buttons">
              <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>

          
          </div>
     </div>
  
   )}
   
</div>

  );
};

export default LinkUp;
