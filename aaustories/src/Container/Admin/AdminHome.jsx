import React, { useEffect, useState } from 'react';
import image from '../../Images/goodmorning.png'
const AdminHome = () => {
  const [greeting, setGreeting] = useState('');
 
  useEffect(() => {
    // Get the current hour
    const currentHour = new Date().getHours();

    // Determine the greeting and image based on the time
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Good Morning Adesuwa');
     // Replace with the URL or path to your morning image
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting('Good Afternoon Adesuwa');
     // Replace with the URL or path to your afternoon image
    } else if (currentHour >= 17 && currentHour < 21) {
      setGreeting('Good Evening Adesuwa');
     // Replace with the URL or path to your evening image
    } else {
      setGreeting('Good Night Adesuwa');
     // Replace with the URL or path to your night image
    }
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className='admin-home-container'>
     <div className='w-full h-40  flex'> 
      <div className='w-[58%] h-full rounded shadow-xl flex items-center p-5'>
        <h1 className=' text-2xl font-extrabold text-[#105daa] uppercase'>{greeting}</h1>
      </div> 
   {/** <div className='w-[38%] h-full shadow-md p-3'>
         <h1 className='text-[#105daa] font-bold underline '>ANNOUNCEMENT</h1>
         <p className='text-[#105daa] '>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam dolore impedit corrupti voluptas alias omnis cum. Doloremque, blanditiis modi! Quia necessitatibus quod quae laboriosam nihil fugiat repellat ea! Quibusdam, beatae?</p>
       </div> 
      </div>
      <div className='w-[60%] flex justify-between p-5'>
       <div className='w-40 h-32 bg-[#105daa] shadow-md rounded flex flex-col justify-center items-center font-bold text-white  uppercase p-2'><p className=' text-[12px] '>Current Balance</p><h1 className='text-3xl'>100</h1></div>
       <div className='w-40 h-32 bg-[#105daa] shadow-md rounded flex flex-col justify-center items-center font-bold text-white  uppercase p-2'><p className=' text-[12px] '>Current Balance</p><h1 className='text-3xl'>100</h1></div>
       <div className='w-40 h-32 bg-[#105daa] shadow-md rounded flex flex-col justify-center items-center font-bold text-white  uppercase p-2'><p className=' text-[12px] '>Current Balance</p><h1 className='text-3xl'>100</h1></div>
      </div>**/}
    </div>
    </div>
  );
};

export default AdminHome;
