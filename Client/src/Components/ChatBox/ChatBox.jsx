import { useEffect } from "react";

import { io } from "socket.io-client"


const ChatBox = () => {
  const username = 'john_doe';

  useEffect(() => {
    const socket = io('http://localhost:4001');
    // Automatic user connection for john_doe
    socket.emit('setUserID', 'john_doe');

    // Sending a test message
    socket.emit('send message', {
      from: 'john_doe',
      to: 'jane_smith',
      message: 'Hello, Jane! This is John.'
    });
  }, []);

  return (
    <div>chat box</div>
  )
}

export default ChatBox;