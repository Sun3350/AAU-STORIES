import React from 'react'
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import './footer.css'
const Footer = () => {
  return (
    <div className='w-full  flex justify-center items-center footer-container'>
      <div className='flex social-footer-icon items-center h-full justify-center mx-10'><a className='mx-3' href="https://www.facebook.com/profile.php?id=61563836244953&mibextid=ZbWKwL"><FaFacebook /></a><a className='social-text' href="https://www.facebook.com/profile.php?id=61563836244953&mibextid=ZbWKwL">Stories Naija</a></div>
      <div className='flex social-footer-icon items-center h-full justify-center mx-10'><a className='mx-3' href="https://instagram.com/aaustories?igshid=MzRlODBiNWFlZA=="><FaInstagram /></a><a className='social-text' href="https://instagram.com/aaustories?igshid=MzRlODBiNWFlZA==">aaustories</a></div>
      <div className='flex social-footer-icon items-center h-full justify-center mx-10'><a className='mx-3' href="https://x.com/aaustories?t=VcGrvbkUBCGVcJwhpVr8Uw&s=09"><FaTwitter /></a><a className='social-text' href="https://x.com/aaustories?t=VcGrvbkUBCGVcJwhpVr8Uw&s=09">aaustories</a></div>
      <div className='flex social-footer-icon items-center h-full justify-center mx-10'><a className='mx-3 flex' href="https://wa.link/874e3f"><FaWhatsapp /><FaTelegram className='mx-2'/> </a><a className='social-text' href="https://telegram.org/dl">09028007788</a></div>
     
    </div>
  )
}

export default Footer
