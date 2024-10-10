import React from 'react'
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import './footer.css'
const Footer = () => {
  return (
    <div className='w-full flex justify-center items-center footer-container'>
      <div className='flex items-center h-full justify-center mx-10'><a className='mx-3' href=""><FaFacebook /></a><a className='social-text' href="">Stories Naija</a></div>
      <div className='flex items-center h-full justify-center mx-10'><a className='mx-3' href=""><FaInstagram /></a><a className='social-text' href="">aaustories</a></div>
      <div className='flex items-center h-full justify-center mx-10'><a className='mx-3' href=""><FaTwitter /></a><a className='social-text' href="">aaustories</a></div>
      <div className='flex items-center h-full justify-center mx-10'><a className='mx-3 flex' href=""><FaWhatsapp /><FaTelegram className='mx-2'/> </a><a className='social-text' href="">09028007788</a></div>
     
    </div>
  )
}

export default Footer
