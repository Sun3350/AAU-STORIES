import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './admin.css';

const socket = io('http://localhost:5000'); // Initialize the socket once outside the component

function ChatComponent() {
  const [chatName, setChatName] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check for an existing chat name in local storage
    const storedChatName = localStorage.getItem('chatName');
    if (storedChatName) {
      setChatName(storedChatName);
      setShowModal(false); // Hide modal if chatName exists
    }

    // Join the 'adminRoom' only if the socket is connected
    if (socket.connected) {
      console.log("Socket is already connected:", socket.id);
      socket.emit('joinRoom', 'adminRoom');
    } else {
      socket.on('connect', () => {
        console.log("Connected with socket ID:", socket.id);
        socket.emit('joinRoom', 'adminRoom');
      });
    }

    // Fetch chat history from the backend
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('https://aau-stories-sever.vercel.app/api/users/chat-history');
        const data = response.data;
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchChatHistory();

    // Listen for new messages
    const handleReceiveMessage = (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    // Listen for new message notifications
    const handleNewMessageNotification = (data) => {
      console.log("New message notification:", data);
      setUnreadCount(data.unreadCount);
    };

    // Listen for clearing of unread messages
    const handleUnreadMessagesCleared = () => {
      console.log("Unread messages cleared");
      setUnreadCount(0);
    };

    // Register event listeners
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('newMessageNotification', handleNewMessageNotification);
    socket.on('unreadMessagesCleared', handleUnreadMessagesCleared);

    // Cleanup function to remove listeners on unmount
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('newMessageNotification', handleNewMessageNotification);
      socket.off('unreadMessagesCleared', handleUnreadMessagesCleared);
    };
  }, []);

  // Handle saving the chat name
  const handleSaveChatName = (name) => {
    console.log("Saving chat name:", name);
    localStorage.setItem('chatName', name);
    setChatName(name);
    setShowModal(false); // Hide modal after saving name
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        sender: chatName,
        message: newMessage,
        room: 'adminRoom',
      };

      // Emit the message to the backend
      console.log("Sending message:", messageData);
      socket.emit('sendMessage', messageData);

      // Add the message to the local state for local rendering
      setMessages((prevMessages) => [...prevMessages, messageData]);
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
      {/* Uncomment this to display unread message count */}
      {/* <div className="unread-messages">Unread Messages: {unreadCount}</div> */}

      <div className="message-list">
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
