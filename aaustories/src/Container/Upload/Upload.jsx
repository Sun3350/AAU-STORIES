import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './upload.css'
import logo from '../../Images/Logo.png'
const statesOfNigeria = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]; 

const CreateUser = () => {
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    gender: '',
    desc: '',
    contact: '',
    image: null,
    facebookLink: '',
    whatsappNumber: '',
    instagramLink: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/upload'); // Navigate to the "/upload" route
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    // Set the selected image in formData
    setFormData({
      ...formData,
      image: selectedImage,
    });

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send form data along with the image
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('location', location);
    formDataToSend.append('gender', gender);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('contact', formData.contact);
    formDataToSend.append('facebookLink', formData.facebookLink);
    formDataToSend.append('whatsappNumber', formData.whatsappNumber);
    formDataToSend.append('instagramLink', formData.instagramLink);
    formDataToSend.append('image', formData.image);  // Add the selected image

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/users', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('User created:', response.data);
    } catch (error) {
      console.error('There was an error creating the user!', error);
    }
  };

  return (
    <div className='upload-container'>
         <div className='header w-full flex justify-between items-center'>
        <a className='text-[#015daa] font-bold' href="/">Close</a> 
        <button 
      className='header-button bg-[#015daa] text-white' 
      onClick={handleNavigation}
    >
      Upload
    </button>
    </div>
    <div className='upload-form flex flex-col justify-between items-center  '>
    <img src={logo} className='logo' alt="" />
      <h2>"Give it a Try"</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-8 mt-5'>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
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
        <input type="text" name="desc" placeholder="Description" onChange={handleChange} required />
        <input type="text" name="contact" placeholder="Contact" onChange={handleChange} required />
        <div className='file-input'>
          <label htmlFor="image">Upload Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && <div className=' h-96 w-fit image-preview'><img src={imagePreview} alt="Image Preview" className="h-full w-full" /></div>}
        </div>
        <input type="text" name="facebookLink" placeholder="Facebook Link" onChange={handleChange} />
        <input type="text" name="whatsappNumber" placeholder="WhatsApp Number" onChange={handleChange} />
        <input type="text" name="instagramLink" placeholder="Instagram Link" onChange={handleChange} />
        <button  className='w-full p-3 bg-[#015daa] text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition' type="submit">Upload</button>
      </form>
    </div>
    </div>
  );
};

export default CreateUser;
