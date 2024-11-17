import { useState, useEffect, useRef } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { database } from '../../utils/Firebase';
import './admin.css';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null); // State to keep track of the message being replied to
  const messageListRef = useRef(null);

  useEffect(() => {
    // Sign in anonymously to Firebase
    const auth = getAuth();
    signInAnonymously(auth)
      .then(() => {
        console.log('Signed in anonymously');
      })
      .catch((error) => {
        console.error('Error signing in anonymously:', error.message);
      });

    // Reference to the messages node in the database
    const messagesRef = ref(database, 'messages');

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = [];
      for (let key in data) {
        loadedMessages.push(data[key]);
      }
      setMessages(loadedMessages);
    });
  }, []);

  // Scroll to the bottom when messages update
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const storedChatName = localStorage.getItem('chatName');

  // Function to handle sending messages
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        sender: storedChatName,
        message: newMessage,
        timestamp: Date.now(),
        replyTo: replyTo ? { sender: replyTo.sender, message: replyTo.message } : null,
      };

      // Push the new message to the Firebase database
      const messagesRef = ref(database, 'messages');
      push(messagesRef, messageData);

      setNewMessage('');
      setReplyTo(null); // Clear the reply reference after sending
    }
  };

  // Function to handle replying to a message
  const handleReply = (msg) => {
    setReplyTo(msg);
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>

      {/* Message list with ref to handle scrolling */}
      <div className="message-list" ref={messageListRef}>
        {messages.map((msg, index) => {
          const messageDate = new Date(msg.timestamp);
          const now = new Date();
          const formattedTime = messageDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

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

          const showDate =
            index === 0 ||
            new Date(messages[index - 1].timestamp).toDateString() !== messageDate.toDateString();

          return (
            <div key={index} className="flex flex-col">
              {showDate && <div className="date-divider shadow-sm">{formattedDate}</div>}
              <div
                className={`message ${
                  msg.sender === storedChatName ? 'current-user' : 'other-user'
                }`}
                onClick={() => handleReply(msg)}
              >
                {/* Show the replied message if available */}
                {msg.replyTo && (
                  <div className="replied-message">
                    <strong>{msg.replyTo.sender}:</strong> {msg.replyTo.message}
                  </div>
                )}
                <strong>{msg.sender === storedChatName ? null : msg.sender}</strong> {msg.message}
                <div className="message-timestamp">
                  <span>{formattedTime}</span>
                </div>
                
              </div>
            </div>
          );
        })}
      </div>

      {/* Display the message being replied to above the input field */}
      {replyTo && (
        <div className="reply-preview shadow-md rounded">
          <div className='w-fit flex text-[#105daa]'><strong>Replying to {replyTo.sender}:</strong> {replyTo.message}</div>
          <button className="cancel-reply shadow-md " onClick={() => setReplyTo(null)}>
           X
          </button>
        </div>
      )}

      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="chat-textarea"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatComponent;
