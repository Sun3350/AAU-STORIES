import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './admin.css';

const socket = io('http://localhost:5000'); // Replace with your server URL

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatName, setChatName] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showModal, setShowModal] = useState(true); // State to control the modal visibility

  // Fetch chat history and join room
  useEffect(() => {
    // Check for an existing chat name in local storage
    const storedChatName = localStorage.getItem('chatName');
    if (storedChatName) {
      setChatName(storedChatName);
      setShowModal(false); // Hide modal if chatName exists
    }

    // Join the 'adminRoom' on connection
    socket.emit('joinRoom', 'adminRoom');

    // Fetch chat history from the backend when the component mounts
    const fetchChatHistory = async () => {
      try {
        const response = await fetch('https://aau-stories-sever.vercel.app/api/users/chat-history'); // Make sure to replace with the correct API URL
        const data = await response.json();
        setMessages(data); // Set the messages from the backend
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    // Listen for new messages
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Listen for new message notifications
    socket.on('newMessageNotification', (data) => {
      setUnreadCount(data.unreadCount);
    });

    // Clear unread messages count when marked as read
    socket.on('unreadMessagesCleared', () => {
      setUnreadCount(0);
    });

    // Ensure the socket is connected and the user joins the room correctly on reconnect
    socket.on('connect', () => {
      console.log("Reconnected with socket ID:", socket.id);
      socket.emit('joinRoom', 'adminRoom');
    });

    // Cleanup socket connection on component unmount
    return () => {
      socket.off('connect');
      socket.disconnect();
    };
  }, []);

  // Handle saving the chat name
  const handleSaveChatName = (name) => {
    localStorage.setItem('chatName', name);
    setChatName(name);
    setShowModal(false); // Hide modal after saving name
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        sender: chatName, // Your chat name
        message: newMessage,
        room: 'adminRoom', // Always use 'adminRoom' for this chat
      };

      // Emit the message to the backend
      socket.emit('sendMessage', messageData);

      // Add the message to the local state for local rendering
      setMessages((prevMessages) => [...prevMessages, messageData]);

      // Clear the input field after sending the message
      setNewMessage('');
    }
  };

  // Modal Component to handle chat name input
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

  // Render the modal if chatName is not set
  if (showModal) {
    return <ChatNameModal onSave={handleSaveChatName} />;
  }

  // Render the chat interface if chatName is set
  return (
    <div className="chat-container">
      <h2>Chat</h2>
{   /**   <div className="unread-messages">Unread Messages: {unreadCount}</div>
*/}      <div className="message-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === chatName ? 'current-user' : 'other-user'}`}
          >
            <strong>{msg.sender === chatName ? 'You' : msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
  
};

export default ChatComponent;
