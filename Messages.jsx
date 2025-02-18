import React from 'react';

export default function Messages({ messages }) {
  return (
    <div className="messages-container">
      {messages?.map((msg, index) => (
        <div key={index} className="message">
          <span style={{ color: msg.color }}>{msg.username}:</span>
          <p>{msg.message}</p>
          <small>{new Date(msg.time).toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
}