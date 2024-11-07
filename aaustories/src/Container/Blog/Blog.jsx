import React,{useEffect, useState} from 'react'
import './blog.css'
import logo from '../../Images/Logo.png'
import axios from 'axios'
const Blog = () => {
  const [latestBlog, setLatestBlog] = useState(null);

  useEffect(() => {
      const fetchLatestBlog = async () => {
          try {
              const response = await axios.get('https://aau-stories-sever.vercel.app/api/users/get-latest-blog');
              setLatestBlog(response.data);
          } catch (error) {
              console.error('Error fetching the latest blog:', error);
          }
      };

      fetchLatestBlog();
  }, []); // Empty dependency array to run only on component mount

  if (!latestBlog) {
      return <p>Loading...</p>; // Optionally handle loading state
  }

  // Format the time since the blog was published (2 hours ago)
  const timeAgo = `${Math.floor((new Date() - new Date(latestBlog.createdAt)) / (1000 * 60 * 60))} hours ago`;

  return (
    <div className='blog-main-container'>
 <div className='header w-full flex justify-between items-center bg-[#105daa] h-20  py-2'>
   <div className='h-full w-16'>  <img className='w-full h-full' src={logo} alt="" />
</div>
  <div className='flex text-white'>
  <li>Tech</li>
  <li>Education</li>
  <li>Fintech</li>
  </div>
  

      <div 
        className=' text-[#fff] font-bold' 
      >
        search
      </div>
  </div>    
  <div className='main-blog-container'>
            <img src={latestBlog.blogImage} alt={latestBlog.title} className='main-blog-image' />
            <div className='main-blog-dec'>
                <h2 className='text-white uppercase'>{latestBlog.title}</h2>
                <p className='pr-36 mt-5'>{latestBlog.content.substring(0, 100)}...</p>
                <div className='flex mt-5'>
                    <p>by {latestBlog.author}</p>
                    <p className='ml-5'>{timeAgo}</p>
                </div>
            </div>
        </div>
  </div>
  )
}

export default Blog
