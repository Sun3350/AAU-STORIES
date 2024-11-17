import React, { useEffect, useState } from 'react';

const AdminHome = () => {
  const [greeting, setGreeting] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [chatName, setChatName] = useState('');

  // Load chat name from localStorage when the component mounts
  useEffect(() => {
    const storedChatName = localStorage.getItem('chatName');
    if (storedChatName) {
      setChatName(storedChatName);
      setShowModal(false); // Hide the modal if a chat name is stored
    }
  }, []);

  // Set greeting based on the current time and chat name
  useEffect(() => {
    const currentHour = new Date().getHours();

    let timeBasedGreeting;
    if (currentHour >= 5 && currentHour < 12) {
      timeBasedGreeting = `Good Morning ${chatName}`;
    } else if (currentHour >= 12 && currentHour < 17) {
      timeBasedGreeting = `Good Afternoon ${chatName}`;
    } else if (currentHour >= 17 && currentHour < 21) {
      timeBasedGreeting = `Good Evening ${chatName}`;
    } else {
      timeBasedGreeting = `Good Night ${chatName}`;
    }

    setGreeting(timeBasedGreeting);
  }, [chatName]); // Re-run this effect whenever chatName changes

  const handleSaveChatName = (name) => {
    localStorage.setItem('chatName', name);
    setChatName(name);
    setShowModal(false); // Hide the modal after saving the name
  };

  // Modal component for entering the chat name
  const ChatNameModal = ({ onSave }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
      if (name.trim() !== '') {
        onSave(name); // Save the chat name and close the modal
      }
    };

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Enter a Chat Name</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    );
  };

  if (showModal) {
    return <ChatNameModal onSave={handleSaveChatName} />;
  }

  return (
    <div className="admin-home-container">
      <div className="w-full h-40 flex">
        <div className="w-[58%] h-full rounded shadow-xl flex items-center p-5">
          <h1 className="text-2xl font-extrabold text-[#105daa] uppercase">{greeting}</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
