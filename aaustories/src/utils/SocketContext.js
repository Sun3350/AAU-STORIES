import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = io('http://localhost:5000'); // Adjust the URL as needed

  useEffect(() => {
    // Handle socket connection
    socket.on('connect', () => {
      console.log("Connected with socket ID:", socket.id);
      socket.emit('joinRoom', 'adminRoom'); // Join the room on connect
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
