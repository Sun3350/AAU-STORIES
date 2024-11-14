import { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { database } from '../../utils/Firebase';
import './admin.css';

function ChatComponent() {
  const [chatName, setChatName] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Check if there's an existing chat name
    const storedChatName = localStorage.getItem('chatName');
    if (storedChatName) {
      setChatName(storedChatName);
      setShowModal(false); // If a chat name is stored, hide the modal
    }

    // Sign in anonymously to Firebase
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log("Signed in anonymously");
      })
      .catch((error) => {
        console.error("Error signing in anonymously:", error.message);
      });

    // Reference to the messages node in the database
    const messagesRef = ref(database, 'messages');

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched data from Firebase:", data); // Check if this logs your messages
      
      const loadedMessages = [];
      for (let key in data) {
        loadedMessages.push(data[key]);
      }
      setMessages(loadedMessages);
    });
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        sender: chatName,
        message: newMessage,
        timestamp: Date.now(),
      };

      // Push the new message to the Firebase database
      const messagesRef = ref(database, 'messages');
      push(messagesRef, messageData);

      setNewMessage('');
    }
  };

  // Handle saving the chat name
  const handleSaveChatName = (name) => {
    console.log("Saving chat name:", name);
    localStorage.setItem('chatName', name);
    setChatName(name);
    setShowModal(false); // Hide modal after saving name
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

      <div className="message-list">
  {messages.map((msg, index) => {
    // Convert the timestamp to a date
    const messageDate = new Date(msg.timestamp);
    const now = new Date();

    // Format time with AM/PM
    const formattedTime = messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // This will add AM/PM
    });

    // Calculate the difference between the current date and the message date
    let formattedDate;
    const isToday = messageDate.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      formattedDate = 'Today';
    } else if (isYesterday) {
      formattedDate = 'Yesterday';
    } else {
      formattedDate = messageDate.toLocaleDateString();
    }

    // Check if this is the first message or if the date has changed compared to the previous message
    const showDate =
      index === 0 ||
      new Date(messages[index - 1].timestamp).toDateString() !== messageDate.toDateString();

    return (
      <div key={index} className='flex flex-col '>
        {/* Display the date as a separate divider if it's a new date */}
        {showDate && <div className="date-divider shadow-sm">{formattedDate}</div>}

        {/* Render the message below the date divider */}
        <div
          className={`message ${msg.sender === chatName ? 'current-user' : 'other-user'}`}
        >
          <strong>{msg.sender === chatName ? 'You' : msg.sender}:</strong> {msg.message}
          <div className="  message-timestamp">
            <span >{formattedTime}</span>
          </div>
        </div>
      </div>
    );
  })}
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
}

export default ChatComponent;
