//client/src/components/sendMessage.jsx
import React, { useState, useContext } from 'react';
import socket from '../socket';
import appContext from '../context';

export default function SendMessage() {
  const [msg, setMsg] = useState('');
  const { room } = useContext(appContext);

  const send = () => {
    if (!msg.trim() || !room?.id) return;
    
    socket.emit('chatMessage', {
      roomId: room.id,
      message: msg.trim()
    });
    
    setMsg('');
  };

  return (
    <div className="send-form">
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && send()}
        placeholder="Type a message..."
      />
      <button onClick={send}>Send</button>
    </div>
  );
}